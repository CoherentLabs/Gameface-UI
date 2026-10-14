// Build-time companion to `src/components/BaseComponent/gameface-dom.ts`: rewrites plain
// Solid style authoring into the `{ value, unit }` / `TransformStyle` shapes
// that runtime already understands, so the CSS Typed OM fast path applies
// without the author having to write `unit(...)` by hand. Registered via
// `solidPlugin({ babel: { plugins: [styleTomPlugin] } })` in vite.config.mts -
// Babel always runs plugins before presets, so this sees the raw JSX before
// babel-preset-solid rewrites it into template/effect calls.
//
// Scope, deliberately: only rewrites what it can prove is safe.
//  - Per-property numeric values: a template literal or `+`-concatenation
//    with exactly one dynamic part and a recognized unit suffix. No suffix
//    at all is left untouched too - guessing a unit the author didn't write
//    is worse than missing the optimization on that one property.
//    A fully static string ("50%", no interpolation) is left alone - Solid
//    bakes fully-static style objects into the template's HTML string, and
//    our nested {value,unit} shape isn't something Solid's own serializer
//    understands, so rewriting a static value would break that path.
//  - `transform`: translate()/scale()/rotate()/skewX()/skewY() calls become
//    `{ functions, values }`, keeping written order and repeated calls - see
//    parseTransformFunctions in gameface-dom.ts for the runtime side.
//  - `style={identifier}` / `style={identifier()}`: follows the binding to
//    a local `const x = () => ({...})` / `createMemo(() => ({...}))` and
//    rewrites its returned object in place - but only when every reference
//    to that binding is itself a style-attribute use, so rewriting it can't
//    change behavior anywhere else that binding is read.
//  - Anything else (props.style, token()?.style, spreads, computed keys,
//    multi-return functions, reassigned bindings) is left exactly as
//    written - no partial/best-guess rewrites, since a wrong axis or a
//    silently-dropped property is worse than missing the optimization.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PluginObj, PluginPass } from '@babel/core';
import type { Binding, NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { beginFile, endFile, recordStyle, setDisabledReason } from './style-tom-report.mts';

// --- Runtime check ---------------------------------------------------------
// The rewritten values only work with the style runtime that ships inside
// BaseComponent, and with BaseComponent using it. Before rewriting anything,
// check that the matching runtime is there; if not, rewrite nothing (the
// build is then exactly what it would be without this plugin) and warn once.

// Must match STYLE_TOM_FORMAT in gameface-dom.ts.
const STYLE_TOM_FORMAT = 2;
// The plugin ships together with BaseComponent, so the runtime is always at
// this spot relative to this file.
const RUNTIME_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../src/components/BaseComponent');
const RUNTIME_FILE = path.join(RUNTIME_DIR, 'gameface-dom.ts');
const BASE_COMPONENT_FILE = path.join(RUNTIME_DIR, 'BaseComponent.tsx');
const UPDATE_HINT = 'Run `gameface-cli update` to install the updated BaseComponent.';

function findRuntimeProblem(): string | null {
  if (!fs.existsSync(RUNTIME_FILE)) return `the style runtime (src/components/BaseComponent/gameface-dom.ts) is missing. ${UPDATE_HINT}`;

  const format = /STYLE_TOM_FORMAT\s*=\s*(\d+)/.exec(fs.readFileSync(RUNTIME_FILE, 'utf8'))?.[1];
  if (Number(format) !== STYLE_TOM_FORMAT) {
    return `the style runtime is a different version (format ${format ?? 'unknown'}, this plugin needs ${STYLE_TOM_FORMAT}). ${UPDATE_HINT}`;
  }

  if (!fs.existsSync(BASE_COMPONENT_FILE) || !/from\s+['"]\.\/gameface-dom['"]/.test(fs.readFileSync(BASE_COMPONENT_FILE, 'utf8'))) {
    return `BaseComponent doesn't use the style runtime, so styles passed to components would break. ${UPDATE_HINT}`;
  }
  return null;
}

// Only success is cached: after a failure every file checks again, so running
// `gameface-cli update` while the dev server is up takes effect immediately.
let runtimeReady = false;
let lastWarning = '';

function checkRuntime(): boolean {
  if (runtimeReady) return true;
  const problem = findRuntimeProblem();
  setDisabledReason(problem);
  if (!problem) return (runtimeReady = true);
  if (problem !== lastWarning) {
    lastWarning = problem;
    console.warn(`[style-tom] Style TOM plugin disabled - ${problem}`);
  }
  return false;
}

// Solid's compiled code must import its style helpers from that same runtime
// (vite.config.mts: solid.moduleName). Babel hides preset options from
// plugins, so this is checked on Solid's output once the file is compiled.
const STYLE_HELPERS = new Set(['style', 'setStyleProperty']);

function checkModuleName(file: { ast: t.File; opts: { filename?: string | null } }): void {
  for (const node of file.ast.program.body) {
    if (!t.isImportDeclaration(node)) continue;
    // Only imports Solid's compiler generated (named `_$style` etc.), not ones
    // written by hand - BaseComponent itself imports from './gameface-dom'.
    const importsStyle = node.specifiers.some((s) =>
      t.isImportSpecifier(s) && s.local.name.startsWith('_$') &&
      t.isIdentifier(s.imported) && STYLE_HELPERS.has(s.imported.name));
    if (!importsStyle) continue;
    const source = node.source.value.startsWith('.') && file.opts.filename
      ? path.resolve(path.dirname(file.opts.filename), node.source.value)
      : node.source.value;
    if (samePath(source, RUNTIME_FILE)) continue;
    throw new Error(
      `[style-tom] ${file.opts.filename}: Solid imports its style helpers from "${node.source.value}", ` +
      `so the styles this plugin rewrote won't work. Set the style runtime as Solid's moduleName in vite.config.mts:\n` +
      `  solidPlugin({ solid: { moduleName: path.resolve(__dirname, './src/components/BaseComponent/gameface-dom.ts') } })`
    );
  }
}

// Vite may hand over the module with or without its .ts extension.
function samePath(a: string, b: string): boolean {
  if (!path.isAbsolute(a)) return false;
  const norm = (p: string) => path.resolve(p).replace(/\\/g, '/').replace(/\.ts$/, '');
  return process.platform === 'win32' ? norm(a).toLowerCase() === norm(b).toLowerCase() : norm(a) === norm(b);
}

type StyleTomPass = PluginPass & { enabled?: boolean };

// --- Property data ---------------------------------------------------------
// Same lists as src/components/BaseComponent/tom-constants.ts, copied so the
// plugin loads even when that file is missing. If they ever drift apart it's
// harmless: the runtime turns a { value, unit } on a property it doesn't
// take through CSSTOM back into a plain string.
const UNITLESS_PROPS = new Set(['opacity', 'z-index', 'flex-grow', 'flex-shrink', 'line-height']);

// https://docs.coherent-labs.com/cpp-gameface/content_development/csstypedobjectmodel/#supported-subset
const SUPPORTED_PROPS = new Set([
  'border-bottom-width', 'border-left-width', 'border-right-width', 'border-top-width',
  'bottom', 'top', 'left', 'right', 'width', 'height',
  'flex-basis', 'flex-grow', 'flex-shrink',
  'font-size', 'letter-spacing', 'line-height',
  'margin-bottom', 'margin-left', 'margin-right', 'margin-top',
  'max-height', 'max-width', 'min-height', 'min-width',
  'opacity', 'z-index',
  'padding-bottom', 'padding-left', 'padding-right', 'padding-top',
  'text-decoration-thickness', 'text-stroke-width', 'text-underline-offset',
]);

function canUseTOM(key: string): boolean {
  return SUPPORTED_PROPS.has(key);
}

// Written CSS suffix -> CSS Typed OM unit keyword. '%' is the only irregular one.
// No 'in': Gameface applies CSSUnitValue(n, 'in') as n px, so `in` stays a string.
const CSS_SUFFIX_TO_UNIT: Record<string, string> = {
  '%': 'percent',
  px: 'px', vw: 'vw', vh: 'vh', vmin: 'vmin', vmax: 'vmax',
  em: 'em', rem: 'rem', pt: 'pt', deg: 'deg', ms: 'ms', s: 's',
};

// Length-only subset, for translate().
const CSS_SUFFIX_TO_LENGTH_UNIT: Record<string, string> = {
  '%': 'percent', px: 'px', vw: 'vw', vh: 'vh', vmin: 'vmin', vmax: 'vmax',
  em: 'em', rem: 'rem', pt: 'pt',
};

const LENGTH_UNITS = 'px, %, vw, vh, vmin, vmax, em, rem, pt';

const REASON = {
  noUnit: 'No unit, so it stays a string. Add the unit, e.g. `${x()}px`.',
  unitlessString: 'The number is turned into a string. Pass the number directly instead, e.g. `opacity: o()`.',
  textAround: 'There is text around the value (e.g. `calc()`). Only a single value followed by its unit can be rewritten, e.g. `${x()}px`.',
  multipleParts: 'More than one dynamic part. Combine them into one expression, e.g. `${a() + b()}px`.',
  conditional: "The plugin doesn't look inside a condition (`? :`). Use the `{ value, unit }` shape in each branch, e.g. `on() ? { value: a(), unit: 'px' } : 'auto'`.",
  bareValue: "The plugin can't see the unit of a plain expression. If it's a string like '10px', pass the number instead: `{ value: n, unit: 'px' }`.",
  bareTransform: "The transform is built outside the style, so the plugin can't see inside it. Write the template literal directly in the style, or use `{ functions, values }`.",
};

function unsupportedUnitReason(suffix: string): string {
  if (suffix === 'in') return `\`in\` is applied as \`px\` by Gameface's CSSTOM, so it stays a string. Supported: ${LENGTH_UNITS}.`;
  return `\`${suffix}\` can't be applied through CSSTOM. Supported: ${LENGTH_UNITS}.`;
}

// Values that never need a report entry: static, or already in a typed shape.
function isStaticOrShape(node: t.Node): boolean {
  if (t.isStringLiteral(node) || t.isNumericLiteral(node) || t.isNullLiteral(node) || t.isObjectExpression(node)) return true;
  if (t.isTemplateLiteral(node)) return node.expressions.length === 0;
  if (t.isIdentifier(node)) return node.name === 'undefined';
  if (t.isUnaryExpression(node)) return t.isNumericLiteral(node.argument);
  if (t.isConditionalExpression(node)) return isStaticOrShape(node.consequent) && isStaticOrShape(node.alternate);
  return false;
}

type Part = { text: string } | { expr: t.Expression };

function buildUnitObject(valueExpr: t.Expression, unit: string): t.ObjectExpression {
  return t.objectExpression([
    t.objectProperty(t.identifier('value'), valueExpr),
    t.objectProperty(t.identifier('unit'), t.stringLiteral(unit)),
  ]);
}

function mergeParts(parts: Part[]): Part[] {
  const merged: Part[] = [];
  for (const p of parts) {
    const last = merged[merged.length - 1];
    if ('text' in p && last && 'text' in last) last.text += p.text;
    else merged.push(p);
  }
  return merged;
}

function templateLiteralToParts(node: t.TemplateLiteral): Part[] {
  const parts: Part[] = [];
  node.quasis.forEach((quasi, i) => {
    if (quasi.value.raw !== '') parts.push({ text: quasi.value.raw });
    if (i < node.expressions.length) parts.push({ expr: node.expressions[i] as t.Expression });
  });
  return parts;
}

// Flattens a `+`-concatenation chain (`a + b + c`, left-associative) into
// the same Part[] shape as a template literal. Returns null for anything
// that isn't purely string literals plus expressions (e.g. numeric math).
function concatToParts(node: t.Expression): Part[] | null {
  if (t.isBinaryExpression(node) && node.operator === '+') {
    const left = concatToParts(node.left as t.Expression);
    const right = concatToParts(node.right as t.Expression);
    if (!left || !right) return null;
    return mergeParts([...left, ...right]);
  }
  if (t.isStringLiteral(node)) return node.value === '' ? [] : [{ text: node.value }];
  if (t.isTemplateLiteral(node) && node.expressions.length === 0) {
    const raw = node.quasis[0].value.raw;
    return raw === '' ? [] : [{ text: raw }];
  }
  return [{ expr: node }];
}

function toParts(node: t.Node): Part[] | null {
  if (t.isTemplateLiteral(node)) {
    if (node.expressions.length === 0) return null; // fully static - leave it alone
    return templateLiteralToParts(node);
  }
  if (t.isBinaryExpression(node) && node.operator === '+') return concatToParts(node);
  return null;
}

// Exactly one dynamic part, nothing before it, and whatever comes after it
// is either empty or a single recognized unit suffix.
function matchSingleValue(parts: Part[]): { expr: t.Expression; suffix: string } | null {
  const exprParts = parts.filter((p): p is { expr: t.Expression } => 'expr' in p);
  if (exprParts.length !== 1) return null;

  const idx = parts.indexOf(exprParts[0]);
  const prefix = parts.slice(0, idx).map((p) => ('text' in p ? p.text : '')).join('');
  if (prefix !== '') return null;

  const suffix = parts.slice(idx + 1).map((p) => ('text' in p ? p.text : '')).join('');
  return { expr: exprParts[0].expr, suffix: suffix.toLowerCase() };
}

// Per-property numeric value: `left: \`${x()}%\`` -> `left: { value: x(), unit: 'percent' }`.
// A dynamic part with no unit suffix at all (`left: \`${x()}\``) is left
// untouched rather than guessing a unit - it falls through to the plain
// `element.style.setProperty` path at runtime, same as before this plugin
// existed, instead of silently assuming "px" was meant.
function tryTransformNumericProperty(key: string, valuePath: NodePath): boolean {
  if (!canUseTOM(key)) return false;
  const node = valuePath.node;
  if (isStaticOrShape(node)) return false; // static, or already optimal

  const parts = toParts(node);
  // `a() + b` with no text in it is arithmetic, not a string being built.
  if (!parts || (t.isBinaryExpression(node) && !parts.some((p) => 'text' in p))) {
    // A number on a unitless property already goes through CSSTOM at runtime.
    if (t.isConditionalExpression(node)) recordStyle(valuePath, key, REASON.conditional);
    else if (!UNITLESS_PROPS.has(key)) recordStyle(valuePath, key, REASON.bareValue);
    return false;
  }

  const match = matchSingleValue(parts);
  if (!match) {
    const dynamicParts = parts.filter((p) => 'expr' in p).length;
    recordStyle(valuePath, key, dynamicParts > 1 ? REASON.multipleParts : REASON.textAround);
    return false;
  }
  if (match.suffix === '') { // no unit info - don't guess
    recordStyle(valuePath, key, UNITLESS_PROPS.has(key) ? REASON.unitlessString : REASON.noUnit);
    return false;
  }

  const unit = CSS_SUFFIX_TO_UNIT[match.suffix];
  if (!unit) {
    recordStyle(valuePath, key, unsupportedUnitReason(match.suffix));
    return false;
  }

  recordStyle(valuePath, key);
  valuePath.replaceWith(buildUnitObject(match.expr, unit));
  return true;
}

const TRANSFORM_FUNCTION_RE = /(translate|scale|rotate|skewX|skewY)\(([^)]*)\)/g;
const TRANSFORM_ARGUMENT_RE = /^(?:(-?\d+(?:\.\d+)?)|@@(\d+)@@)([a-z%]*)$/;

// `transform: \`translate(-50%, -50%) scale(${s()}) rotate(${r()}deg)\`` ->
// `{ functions: 'translate(percent,percent) scale(number) rotate(deg)', values: [-50, -50, s(), r()] }`.
// Builds a "virtual string" with each dynamic part replaced by a `@@N@@`
// placeholder, so the string can be parsed with regexes; each argument then
// resolves to either a number literal or the original expression.
function tryTransformTransformProperty(valuePath: NodePath): boolean {
  const node = valuePath.node;
  if (isStaticOrShape(node)) return false; // static, or already structured

  const parts = toParts(node);
  if (!parts) {
    recordStyle(valuePath, 'transform', t.isConditionalExpression(node) ? REASON.conditional : REASON.bareTransform);
    return false;
  }
  const miss = (reason: string) => {
    recordStyle(valuePath, 'transform', reason);
    return false;
  };

  const exprs: t.Expression[] = [];
  const text = parts
    .map((p) => {
      if ('text' in p) return p.text;
      exprs.push(p.expr);
      return `@@${exprs.length - 1}@@`;
    })
    .join('');

  const remainder = text.replace(TRANSFORM_FUNCTION_RE, '').trim();
  if (remainder !== '') {
    const others = [...new Set([...remainder.matchAll(/([a-zA-Z][\w-]*)\s*\(/g)].map((m) => m[1]))];
    if (others.includes('skew')) return miss("Gameface doesn't support `skew()`. Use `skewX()` and `skewY()`.");
    if (others.length) {
      return miss(`${others.map((n) => `\`${n}()\``).join(', ')} can't be rewritten. Supported: \`translate()\`, \`scale()\`, \`rotate()\`, \`skewX()\`, \`skewY()\`.`);
    }
    return miss('The value has text that isn\'t a transform function.');
  }

  const resolveArg = (raw: string): { expr: t.Expression; suffix: string } | null => {
    const m = TRANSFORM_ARGUMENT_RE.exec(raw.trim());
    if (!m) return null;
    const [, literal, sentinel, suffix] = m;
    const expr = literal !== undefined ? t.numericLiteral(parseFloat(literal)) : exprs[parseInt(sentinel, 10)];
    return { expr, suffix };
  };

  // Same rule as per-property values: no unit is only valid CSS for a
  // literal 0, so anything else unitless leaves the whole value alone
  // instead of guessing px/deg.
  type Arg = { expr: t.Expression; suffix: string };
  const isZero = (a: Arg) => t.isNumericLiteral(a.expr) && a.expr.value === 0;
  const lengthUnit = (a: Arg) =>
    a.suffix === '' ? (isZero(a) ? 'px' : null) : CSS_SUFFIX_TO_LENGTH_UNIT[a.suffix] ?? null;
  const isDegrees = (a: Arg) => a.suffix === 'deg' || (a.suffix === '' && isZero(a));

  // Functions are kept in written order, one entry per call - repeated
  // functions are just repeated entries, which CSSTOM composes like CSS.
  const functionList: string[] = [];
  const values: t.Expression[] = [];

  TRANSFORM_FUNCTION_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TRANSFORM_FUNCTION_RE.exec(text))) {
    const [, fn, argsRaw] = m;
    const args = argsRaw.split(',').map((a) => resolveArg(a));
    if (args.some((a) => !a)) return miss(`An argument of \`${fn}()\` isn't a single number with a unit.`);
    const resolved = args as Arg[];

    const maxArguments = fn === 'translate' || fn === 'scale' ? 2 : 1;
    if (resolved.length > maxArguments) return miss(`\`${fn}()\` has too many arguments.`);

    let units: (string | null)[];
    if (fn === 'translate') units = resolved.map(lengthUnit);
    else if (fn === 'scale') units = resolved.map((a) => (a.suffix === '' ? 'number' : null));
    else units = resolved.map((a) => (isDegrees(a) ? 'deg' : null));

    const bad = resolved[units.findIndex((u) => !u)];
    if (bad) {
      if (fn === 'scale') return miss('`scale()` takes plain numbers, without a unit.');
      if (fn !== 'translate') {
        return miss(bad.suffix === ''
          ? `\`${fn}()\` has a value without a unit. Add \`deg\`, e.g. \`${fn}(\${a()}deg)\`.`
          : `\`${fn}()\` only accepts \`deg\` - Gameface doesn't support \`${bad.suffix}\`.`);
      }
      return miss(bad.suffix === ''
        ? 'A `translate()` value has no unit. Add one, e.g. `translate(${x()}px)`.'
        : unsupportedUnitReason(bad.suffix));
    }

    functionList.push(`${fn}(${units.join(',')})`);
    for (const a of resolved) values.push(a.expr);
  }

  if (functionList.length === 0) return false;

  recordStyle(valuePath, 'transform');
  valuePath.replaceWith(t.objectExpression([
    t.objectProperty(t.identifier('functions'), t.stringLiteral(functionList.join(' '))),
    t.objectProperty(t.identifier('values'), t.arrayExpression(values)),
  ]));
  return true;
}

function transformStyleObject(objPath: NodePath): void {
  if (!objPath.isObjectExpression()) return;
  for (const propPath of objPath.get('properties')) {
    if (!propPath.isObjectProperty() || propPath.node.computed) continue;

    const keyNode = propPath.node.key;
    const key = t.isIdentifier(keyNode) ? keyNode.name : t.isStringLiteral(keyNode) ? keyNode.value : null;
    if (key === null) continue;

    const valuePath = propPath.get('value');
    if (key === 'transform') {
      tryTransformTransformProperty(valuePath);
      continue;
    }
    tryTransformNumericProperty(key, valuePath);
  }
}

function isStyleAttrName(name: t.JSXAttribute['name']): boolean {
  return t.isJSXIdentifier(name) && name.name === 'style';
}

function styleDirectiveProp(name: t.JSXAttribute['name']): string | null {
  return t.isJSXNamespacedName(name) && name.namespace.name === 'style' ? name.name.name : null;
}

function isStyleAttributeExpression(path: NodePath): boolean {
  const container = path.parentPath;
  if (!container || !container.isJSXExpressionContainer()) return false;
  const attr = container.parentPath;
  if (!attr || !attr.isJSXAttribute()) return false;
  return isStyleAttrName(attr.node.name) || styleDirectiveProp(attr.node.name) !== null;
}

// Only follow a binding into its declaration when every use of it is itself
// a style-attribute value - otherwise rewriting its returned shape could
// change behavior for some other, unrelated consumer of the same function.
function allReferencesAreStyleUses(binding: Binding): boolean {
  if (binding.referencePaths.length === 0) return false;
  return binding.referencePaths.every((refPath) => {
    if (isStyleAttributeExpression(refPath)) return true;
    const parent = refPath.parentPath;
    if (!parent) return false;
    const isCall = parent.isCallExpression() || parent.isOptionalCallExpression();
    if (isCall && parent.get('callee') === refPath) return isStyleAttributeExpression(parent);
    return false;
  });
}

function extractReturnedExpr(fnPath: NodePath): NodePath | null {
  if (!fnPath.isFunction()) return null;
  const bodyPath = fnPath.get('body') as NodePath;

  if (bodyPath.isExpression()) return bodyPath; // arrow implicit return: () => expr
  if (!bodyPath.isBlockStatement()) return null;

  const returns = bodyPath.get('body').filter((s) => s.isReturnStatement());
  if (returns.length !== 1) return null; // multiple/conditional returns - too ambiguous to trust

  const argPath = (returns[0] as NodePath<t.ReturnStatement>).get('argument') as NodePath;
  return argPath.node ? argPath : null;
}

function unwrapToReturnedExpr(initPath: NodePath): NodePath | null {
  if (initPath.isArrowFunctionExpression() || initPath.isFunctionExpression()) {
    return extractReturnedExpr(initPath);
  }
  if (initPath.isCallExpression()) {
    // createMemo(() => {...}) and similar zero-arg-callback wrappers.
    for (const argPath of initPath.get('arguments')) {
      if (
        (argPath.isArrowFunctionExpression() || argPath.isFunctionExpression()) &&
        argPath.node.params.length === 0
      ) {
        return extractReturnedExpr(argPath);
      }
    }
  }
  return null;
}

function findReturnedExpr(declPath: NodePath): NodePath | null {
  if (declPath.isVariableDeclarator()) {
    const initPath = declPath.get('init') as NodePath;
    return initPath.node ? unwrapToReturnedExpr(initPath) : null;
  }
  if (declPath.isFunctionDeclaration()) return extractReturnedExpr(declPath);
  return null;
}

const MAX_FOLLOW_DEPTH = 3;

function handleStyleValue(exprPath: NodePath, depth = 0): void {
  if (exprPath.isObjectExpression()) {
    transformStyleObject(exprPath);
    return;
  }

  if (depth >= MAX_FOLLOW_DEPTH) return;

  let calleePath: NodePath | null = null;
  if (exprPath.isCallExpression() || exprPath.isOptionalCallExpression()) {
    const callee = exprPath.get('callee') as NodePath;
    if (callee.isIdentifier()) calleePath = callee;
  } else if (exprPath.isIdentifier()) {
    calleePath = exprPath;
  }
  if (!calleePath) return;

  const binding = calleePath.scope.getBinding((calleePath.node as t.Identifier).name);
  if (!binding || !binding.constant) return; // reassignable - can't trust a snapshot of its body

  if (!allReferencesAreStyleUses(binding)) return;

  const returned = findReturnedExpr(binding.path);
  if (!returned) return;

  handleStyleValue(returned, depth + 1);
}

function visitAttribute(attrPath: NodePath<t.JSXAttribute>): void {
  const nameNode = attrPath.node.name;
  const directiveProp = styleDirectiveProp(nameNode);
  const isStyle = isStyleAttrName(nameNode);
  if (!directiveProp && !isStyle) return;

  const valuePath = attrPath.get('value');
  if (!valuePath.isJSXExpressionContainer()) return;
  const exprPath = valuePath.get('expression') as NodePath;
  if (!exprPath.node) return;

  if (directiveProp) {
    if (directiveProp === 'transform') {
      tryTransformTransformProperty(exprPath);
      return;
    }
    tryTransformNumericProperty(directiveProp, exprPath);
    return;
  }

  handleStyleValue(exprPath);
}

export default function styleTomPlugin(): PluginObj<StyleTomPass> {
  return {
    name: 'gameface-style-tom',
    pre(file) {
      this.enabled = checkRuntime();
      // Report bookkeeping (dev server only - no-ops otherwise).
      if (file.opts.filename) beginFile(file.opts.filename);
    },
    post(file) {
      if (this.enabled) checkModuleName(file as unknown as Parameters<typeof checkModuleName>[0]);
      if (file.opts.filename) endFile(file.opts.filename);
    },
    visitor: {
      // babel-plugin-jsx-dom-expressions (inside babel-preset-solid) also
      // hooks JSXElement/JSXFragment and, on entering one, does its own
      // internal walk of the whole subtree and replaces it wholesale with
      // template/effect calls - Babel never gets to independently "enter"
      // the JSXAttribute/JSXOpeningElement nodes inside it afterward, no
      // matter what node type this plugin's own visitor targets. Babel does
      // guarantee plugins run before presets *for the same node type*
      // though, so hooking JSXElement here and manually traversing into it
      // (via `path.traverse`, not a second top-level visitor key) reaches
      // every nested style attribute - including inside nested elements -
      // in one synchronous pass, before Solid's own JSXElement visitor for
      // this same node gets its turn and consumes the tree.
      JSXElement(path, state) {
        if (state.enabled) path.traverse({ JSXAttribute: visitAttribute });
      },
      JSXFragment(path, state) {
        if (state.enabled) path.traverse({ JSXAttribute: visitAttribute });
      },
    },
  };
}
