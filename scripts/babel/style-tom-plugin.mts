// Build-time companion to `src/renderer/gameface-dom.ts`: rewrites plain
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
//  - `transform`: same idea but for the translate()/scale()/rotate() shorthand
//    grammar `applyTransform` already models - see parseTransformString in
//    gameface-dom.ts for the runtime twin of this parser.
//  - `style={identifier}` / `style={identifier()}`: follows the binding to
//    a local `const x = () => ({...})` / `createMemo(() => ({...}))` and
//    rewrites its returned object in place - but only when every reference
//    to that binding is itself a style-attribute use, so rewriting it can't
//    change behavior anywhere else that binding is read.
//  - Anything else (props.style, token()?.style, spreads, computed keys,
//    multi-return functions, reassigned bindings) is left exactly as
//    written - no partial/best-guess rewrites, since a wrong axis or a
//    silently-dropped property is worse than missing the optimization.
import type { PluginObj } from '@babel/core';
import type { Binding, NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import {
  CSS_SUFFIX_TO_LENGTH_UNIT,
  CSS_SUFFIX_TO_UNIT,
  canUseTOM,
} from '../../src/renderer/tom-constants';

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

function isUnitObjectShape(node: t.Node): boolean {
  if (!t.isObjectExpression(node)) return false;
  const keys = node.properties.map((p) => (t.isObjectProperty(p) && t.isIdentifier(p.key) ? p.key.name : null));
  return keys.includes('value') && keys.includes('unit');
}

// Per-property numeric value: `left: \`${x()}%\`` -> `left: { value: x(), unit: 'percent' }`.
// A dynamic part with no unit suffix at all (`left: \`${x()}\``) is left
// untouched rather than guessing a unit - it falls through to the plain
// `element.style.setProperty` path at runtime, same as before this plugin
// existed, instead of silently assuming "px" was meant.
function tryTransformNumericProperty(key: string, valuePath: NodePath): boolean {
  if (!canUseTOM(key)) return false;
  if (isUnitObjectShape(valuePath.node)) return false; // already optimal

  const parts = toParts(valuePath.node);
  if (!parts) return false;

  const match = matchSingleValue(parts);
  if (!match) return false;
  if (match.suffix === '') return false; // no unit info - don't guess

  const unit = CSS_SUFFIX_TO_UNIT[match.suffix];
  if (!unit) return false;

  valuePath.replaceWith(buildUnitObject(match.expr, unit));
  return true;
}

const TRANSFORM_FN_RE = /(translate|scale|rotate|skewX|skewY|skew)\(([^)]*)\)/g;
const TRANSFORM_TOKEN_RE = /^(?:(-?\d+(?:\.\d+)?)|@@(\d+)@@)([a-z%]*)$/;

// `transform: \`translate(-50%, -50%) scale(${s()}) rotate(${r()}deg)\`` ->
// the structured TransformStyle object. Builds a "virtual string" with each
// dynamic part replaced by a `@@N@@` sentinel, so the same regex-driven walk
// the runtime parser uses on a real string can run here too, just resolving
// each numeric token to either a literal or the original expression node.
function tryTransformTransformProperty(valuePath: NodePath): boolean {
  if (isUnitObjectShape(valuePath.node) || t.isObjectExpression(valuePath.node)) return false; // already structured

  const parts = toParts(valuePath.node);
  if (!parts) return false;

  const exprs: t.Expression[] = [];
  const text = parts
    .map((p) => {
      if ('text' in p) return p.text;
      exprs.push(p.expr);
      return `@@${exprs.length - 1}@@`;
    })
    .join('');

  const remainder = text.replace(TRANSFORM_FN_RE, '').trim();
  if (remainder !== '') return false;

  const resolveArg = (raw: string): { expr: t.Expression; suffix: string } | null => {
    const m = TRANSFORM_TOKEN_RE.exec(raw.trim());
    if (!m) return null;
    const [, literal, sentinel, suffix] = m;
    const expr = literal !== undefined ? t.numericLiteral(parseFloat(literal)) : exprs[parseInt(sentinel, 10)];
    return { expr, suffix };
  };

  let translateX: t.ObjectExpression | null = null;
  let translateY: t.ObjectExpression | null = null;
  let scaleX: t.Expression = t.numericLiteral(1);
  let scaleY: t.Expression = t.numericLiteral(1);
  let rotate: t.Expression = t.numericLiteral(0);
  let skewX: t.Expression | null = null;
  let skewY: t.Expression | null = null;
  let matched = false;

  TRANSFORM_FN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TRANSFORM_FN_RE.exec(text))) {
    const [, fn, argsRaw] = m;
    const args = argsRaw.split(',').map((a) => a.trim()).filter((a) => a !== '');
    if (args.length === 0) return false;

    if (fn === 'translate') {
      const x = resolveArg(args[0]);
      const y = args.length > 1 ? resolveArg(args[1]) : { expr: t.numericLiteral(0), suffix: 'px' };
      if (!x || !y) return false;
      const xUnit = x.suffix === '' ? 'px' : CSS_SUFFIX_TO_LENGTH_UNIT[x.suffix];
      const yUnit = y.suffix === '' ? 'px' : CSS_SUFFIX_TO_LENGTH_UNIT[y.suffix];
      if (!xUnit || !yUnit) return false;
      translateX = buildUnitObject(x.expr, xUnit);
      translateY = buildUnitObject(y.expr, yUnit);
    } else if (fn === 'scale') {
      const sx = resolveArg(args[0]);
      // scale(s) means scaleY = scaleX - clone so the same node isn't
      // inserted into two places in the resulting tree.
      const sy = args.length > 1 ? resolveArg(args[1]) : (sx && { expr: t.cloneNode(sx.expr, true), suffix: sx.suffix });
      if (!sx || !sy || sx.suffix !== '' || sy.suffix !== '') return false;
      scaleX = sx.expr;
      scaleY = sy.expr;
    } else if (fn === 'rotate') {
      const r = resolveArg(args[0]);
      if (!r || (r.suffix !== '' && r.suffix !== 'deg')) return false;
      rotate = r.expr;
    } else if (fn === 'skew') {
      const kx = resolveArg(args[0]);
      const ky = args.length > 1 ? resolveArg(args[1]) : { expr: t.numericLiteral(0), suffix: 'deg' };
      if (!kx || !ky) return false;
      if ((kx.suffix !== '' && kx.suffix !== 'deg') || (ky.suffix !== '' && ky.suffix !== 'deg')) return false;
      skewX = kx.expr;
      skewY = ky.expr;
    } else if (fn === 'skewX') {
      const kx = resolveArg(args[0]);
      if (!kx || (kx.suffix !== '' && kx.suffix !== 'deg')) return false;
      skewX = kx.expr;
      skewY ??= t.numericLiteral(0);
    } else if (fn === 'skewY') {
      const ky = resolveArg(args[0]);
      if (!ky || (ky.suffix !== '' && ky.suffix !== 'deg')) return false;
      skewY = ky.expr;
      skewX ??= t.numericLiteral(0);
    } else {
      return false;
    }
    matched = true;
  }

  if (!matched) return false;

  const properties = [
    t.objectProperty(t.identifier('translateX'), translateX ?? buildUnitObject(t.numericLiteral(0), 'px')),
    t.objectProperty(t.identifier('translateY'), translateY ?? buildUnitObject(t.numericLiteral(0), 'px')),
    t.objectProperty(t.identifier('scaleX'), scaleX),
    t.objectProperty(t.identifier('scaleY'), scaleY),
    t.objectProperty(t.identifier('rotate'), rotate),
  ];
  // skewX/skewY are optional on TransformStyle - only emit them when the
  // source string actually used skew(), instead of padding every transform
  // (the overwhelming majority, which never skew) with `skewX: 0, skewY: 0`.
  if (skewX && skewY) {
    properties.push(
      t.objectProperty(t.identifier('skewX'), skewX),
      t.objectProperty(t.identifier('skewY'), skewY)
    );
  }

  valuePath.replaceWith(t.objectExpression(properties));
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

export default function styleTomPlugin(): PluginObj {
  return {
    name: 'gameface-style-tom',
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
      JSXElement(path) {
        path.traverse({ JSXAttribute: visitAttribute });
      },
    },
  };
}
