// Drop-in replacement for the parts of `solid-js/web` that write inline
// styles. Everything else Solid needs (templating, insertion, event
// delegation, control-flow components, ...) is re-exported untouched - see
// `solid.moduleName` in vite.config.mts for how this module is wired in.
//
// `style={...}` and `style:prop={...}` bindings normally go through
// `element.style`, which means every write is a string that Gameface has to
// parse. Gameface's CSS Typed Object Model (attributeStyleMap) accepts
// already-typed values instead, skipping that parsing step:
// https://docs.coherent-labs.com/cpp-gameface/content_development/csstypedobjectmodel/
export * from 'solid-js/web';

import type { Accessor } from 'solid-js';
import type { NumericCSSProperty, TransformStyle, TypedOMUnit } from '@components/types';
import { canUseTOM, defaultUnitFor, unitToCssSuffix } from './tom-constants';

// Version of the value shapes this runtime understands ({ value, unit } and
// { functions, values }). The Style TOM plugin reads it and stops rewriting
// if it expects a different one - bump both together when a shape changes.
export const STYLE_TOM_FORMAT = 2;

function resolveNumeric(value: Accessor<number> | number): number {
  return typeof value === 'function' ? value() : value;
}

// A transform arrives as `{ functions, values }`:
//   functions: 'rotate(deg) translate(px,px)' - the transform functions in
//              written order, with the unit of each argument in brackets
//   values:    [45, 10, 20] - the numbers, in the same order
const ANY_FUNCTION_RE = /([a-zA-Z0-9]+)\(([^)]*)\)/g;

// Turns `{ functions, values }` back into a normal CSS string, e.g.
// 'rotate(45deg) translate(10px, 20px)'. Used for elements without
// attributeStyleMap, and for functions CSSTOM can't represent.
function transformToCss(transform: TransformStyle): string {
  let valueIndex = 0;
  return transform.functions.replace(ANY_FUNCTION_RE, (_, functionName: string, unitList: string) => {
    const args = unitList.split(',').map((unit) =>
      resolveNumeric(transform.values[valueIndex++]) + unitToCssSuffix(unit.trim() as TypedOMUnit)
    );
    return `${functionName}(${args.join(', ')})`;
  });
}

type TransformFunctionName = 'translate' | 'scale' | 'rotate' | 'skewX' | 'skewY';
type TransformFunction = { name: TransformFunctionName; units: TypedOMUnit[] };

// Each distinct `functions` string is parsed only once. Plugin output only
// ever produces a handful of them, so this stays tiny.
// null = can't be represented through CSSTOM.
const parsedFunctionsCache = new Map<string, TransformFunction[] | null>();
const SUPPORTED_FUNCTIONS = new Set(['translate', 'scale', 'rotate', 'skewX', 'skewY']);

function parseTransformFunctions(functions: string): TransformFunction[] | null {
  const cached = parsedFunctionsCache.get(functions);
  if (cached !== undefined) return cached;

  let parsed: TransformFunction[] | null = [];
  for (const [, name, unitList] of functions.matchAll(ANY_FUNCTION_RE)) {
    const units = unitList.split(',').map((unit) => unit.trim()) as TypedOMUnit[];
    const maxArguments = name === 'translate' || name === 'scale' ? 2 : 1;
    if (!SUPPORTED_FUNCTIONS.has(name) || units.length > maxArguments) { parsed = null; break; }
    parsed.push({ name: name as TransformFunctionName, units });
  }
  // Anything besides functions and spaces (a typo, a stray word) - not ours to guess.
  if (parsed && (parsed.length === 0 || functions.replace(ANY_FUNCTION_RE, '').trim() !== '')) parsed = null;
  parsedFunctionsCache.set(functions, parsed);
  return parsed;
}

// Where a number from `values` gets written to.
const WRITE_UNIT_VALUE = 0;  // a CSSUnitValue's .value (translate, rotate, skew)
const WRITE_SCALE_X = 1;     // a CSSScale's .x
const WRITE_SCALE_Y = 2;     // a CSSScale's .y
const WRITE_SCALE_BOTH = 3;  // a CSSScale's .x and .y - scale() with one argument

// Everything kept per element so an update only has to change numbers.
// The arrays are parallel to `values`: entry i describes values[i].
interface TransformCache {
  functions: string;                    // which `functions` this was built for
  transformValue: CSSTransformValue;    // the object handed to attributeStyleMap
  writeKinds: number[];                 // how to write values[i]
  writeTargets: (CSSUnitValue | CSSScale)[]; // what to write values[i] into
  // The numbers last written. Comparing against these plain JS numbers is
  // cheap; reading the same numbers back off the native CSSTOM objects
  // would cost more than just writing.
  lastValues: number[];
}

function buildTransformCache(functions: string, parsed: TransformFunction[]): TransformCache {
  const components: CSSTransformComponent[] = [];
  const writeKinds: number[] = [];
  const writeTargets: (CSSUnitValue | CSSScale)[] = [];

  // Write targets are read back off each component after creating it:
  // Gameface's components copy the CSSUnitValue passed in, so only the
  // read-back object is the one actually used for rendering.
  for (const { name, units } of parsed) {
    if (name === 'translate') {
      const translate = new CSSTranslate(new CSSUnitValue(0, units[0]), new CSSUnitValue(0, units[1] ?? 'px'));
      components.push(translate);
      writeKinds.push(WRITE_UNIT_VALUE);
      writeTargets.push(translate.x as CSSUnitValue);
      if (units.length === 2) {
        writeKinds.push(WRITE_UNIT_VALUE);
        writeTargets.push(translate.y as CSSUnitValue);
      }
    } else if (name === 'scale') {
      const scale = new CSSScale(1, 1);
      components.push(scale);
      if (units.length === 2) {
        writeKinds.push(WRITE_SCALE_X, WRITE_SCALE_Y);
        writeTargets.push(scale, scale);
      }
      else {
        writeKinds.push(WRITE_SCALE_BOTH);
        writeTargets.push(scale);
      }
    } else if (name === 'rotate') {
      const rotate = new CSSRotate(new CSSUnitValue(0, units[0]));
      components.push(rotate);
      writeKinds.push(WRITE_UNIT_VALUE);
      writeTargets.push(rotate.angle as CSSUnitValue);
    } else if (name === 'skewX') {
      const skewX = new CSSSkewX(new CSSUnitValue(0, units[0]));
      components.push(skewX);
      writeKinds.push(WRITE_UNIT_VALUE);
      writeTargets.push(skewX.ax as CSSUnitValue);
    } else {
      const skewY = new CSSSkewY(new CSSUnitValue(0, units[0]));
      components.push(skewY);
      writeKinds.push(WRITE_UNIT_VALUE);
      writeTargets.push(skewY.ay as CSSUnitValue);
    }
  }

  return {
    functions,
    transformValue: new CSSTransformValue(components),
    writeKinds,
    writeTargets,
    // NaN, not real values - `x !== NaN` is always true, so the first update
    // after (re)building always writes. Matters when the cache is rebuilt
    // after a plain-string transform (see setProp): it can't know what's on
    // the element, so a coincidental match must not count as "unchanged".
    lastValues: writeKinds.map(() => NaN)
  };
}

interface StyleCache {
  // null on elements without CSSTOM support (e.g. SVG) - every write for
  // that element then falls back to `element.style`.
  map: StylePropertyMap | null;
  // One entry per numeric property, reused and mutated in place on every
  // update instead of being reallocated. A real Map, not a plain object:
  // this is read/written with a key that varies per call (a different CSS
  // property name every time), which is exactly the case V8 can't build a
  // fast monomorphic inline cache for on a plain object - every
  // `obj[dynamicKey]` access falls back to a slow, generic hash lookup.
  // Map.get/set are built for precisely this access pattern.
  //
  // `magnitude`/`unit` are OUR OWN plain-JS copies of what `value` (the
  // native CSSUnitValue) currently holds - not redundant bookkeeping.
  // Measured directly: reading `.value`/`.unit` off a real CSSUnitValue
  // costs ~15-30x a plain object property read (it crosses into the
  // engine's native CSS Typed OM implementation on every single access,
  // get OR set). Comparing against our own plain fields to decide whether a
  // write is even needed is what actually makes the "skip if unchanged"
  // check cheap; comparing the same values by reading them back off the
  // native object every time would cost more than just writing regardless.
  units: Map<string, { value: CSSUnitValue; magnitude: number; unit: string }>;
  // lazily built, reused for the lifetime of the element.
  transform?: TransformCache;
}

// Symbol-keyed expando on the element itself: a direct property read beats a
// WeakMap lookup, and the cache is garbage-collected together with the
// element - nothing to clean up on unmount.
const CACHE_KEY = Symbol('gfStyleCache');

function getCache(node: Element): StyleCache {
  const existing = (node as unknown as Record<symbol, StyleCache>)[CACHE_KEY];
  if (existing) return existing;

  const cache: StyleCache = {
    map: 'attributeStyleMap' in node ? (node as HTMLElement).attributeStyleMap : null,
    units: new Map()
  };
  Object.defineProperty(node, CACHE_KEY, { value: cache });
  return cache;
}

// For callers that replace the whole inline style outside setProp
// (`removeAttribute('style')`, `style.cssText = ...`): that wipes what the
// cache believes is applied, so a later identical value would be skipped.
export function resetStyleCache(node: Element): void {
  const cache = (node as unknown as Record<symbol, StyleCache>)[CACHE_KEY];
  if (!cache) return;
  cache.units.clear();
  cache.transform = undefined;
}

// Gameface bug (seen on cohtml 3.1.2): if the first attributeStyleMap.set()
// of a CSSTransformValue has a translate of exactly (0, 0), that object is
// broken for good - later y writes land in x and y stays 0. Zeros in later
// sets are fine, so a new transform must not start at (0, 0).
function hasZeroTranslate(parsed: TransformFunction[], values: TransformStyle['values']): boolean {
  let valueIndex = 0;
  for (const { name, units } of parsed) {
    if (name === 'translate') {
      const x = resolveNumeric(values[valueIndex]);
      const y = units.length === 2 ? resolveNumeric(values[valueIndex + 1]) : 0;
      if (x === 0 && y === 0) return true;
    }
    valueIndex += units.length;
  }
  return false;
}

// Returns false when `transform` can't go through CSSTOM right now.
function applyTransform(map: StylePropertyMap, cache: StyleCache, transform: TransformStyle): boolean {
  let transformCache = cache.transform;
  // One string comparison per update. The plugin always emits the same
  // string for a given JSX line, so this only rebuilds on the first update
  // (or if a hand-written value changes its functions).
  if (!transformCache || transformCache.functions !== transform.functions) {
    const parsed = parseTransformFunctions(transform.functions);
    // A (0, 0) translate goes out as a plain string instead; the CSSTOM
    // transform gets built on the first update with a non-zero translate.
    if (!parsed || hasZeroTranslate(parsed, transform.values)) return false;
    transformCache = cache.transform = buildTransformCache(transform.functions, parsed);
  }

  const { writeKinds, writeTargets, lastValues } = transformCache;
  let anyChanged = false;
  for (let i = 0; i < writeKinds.length; i++) {
    const newValue = resolveNumeric(transform.values[i]);
    if (newValue === lastValues[i]) continue;
    lastValues[i] = newValue;
    anyChanged = true;
    const target = writeTargets[i];
    switch (writeKinds[i]) {
      case WRITE_UNIT_VALUE: (target as CSSUnitValue).value = newValue; break;
      case WRITE_SCALE_X: (target as CSSScale).x = newValue; break;
      case WRITE_SCALE_Y: (target as CSSScale).y = newValue; break;
      default: (target as CSSScale).x = newValue; (target as CSSScale).y = newValue;
    }
  }

  if (anyChanged) map.set('transform', transformCache.transformValue);
  return true;
}

function setProp(node: Element, cache: StyleCache, key: string, value: unknown): void {
  if (key === 'transform') {
    if (value && typeof value === 'object') {
      if (cache.map && applyTransform(cache.map, cache, value as TransformStyle)) return;
      cache.transform = undefined;
      (node as HTMLElement).style.setProperty('transform', transformToCss(value as TransformStyle));
      return;
    }
    // Falling back to a plain string/keyword for `transform` (e.g. a value
    // that toggles between a TransformStyle and a plain string across
    // renders) - this write bypasses `cache.transform` entirely, so its
    // bookkeeping no longer reflects what's really on the element. Drop it
    // so a structured TransformStyle coming back later rebuilds fresh
    // instead of trusting stale prev values and skipping a needed write.
    cache.transform = undefined;
    (node as HTMLElement).style.setProperty('transform', String(value));
    return;
  }

  const isUnitDescriptor = typeof value === 'object' && value !== null && 'value' in value;
  const isNumeric = typeof value === 'number' || isUnitDescriptor;

  // Fast path: numeric value, this element supports attributeStyleMap, and
  // the property isn't a shorthand/custom prop CSSTOM can't represent.
  if (isNumeric && cache.map && canUseTOM(key)) {
    // Pull the raw magnitude/unit out of whichever shape we were given -
    // a bare number always means the property's own default unit.
    const magnitude = isUnitDescriptor ? resolveNumeric((value as NumericCSSProperty).value) : (value as number);
    const desiredUnit = isUnitDescriptor
      ? (value as NumericCSSProperty).unit ?? defaultUnitFor(key)
      : defaultUnitFor(key);

    let cached = cache.units.get(key);
    if (cached && cached.unit === desiredUnit) {
      if (cached.magnitude === magnitude) return;

      cached.value.value = cached.magnitude = magnitude;
    } else {
      // No cached entry, or the unit changed (CSSUnitValue.unit is
      // read-only, so a unit change always needs a fresh instance).
      cached = { value: new CSSUnitValue(magnitude, desiredUnit), magnitude, unit: desiredUnit };
      cache.units.set(key, cached);
    }

    cache.map.set(key, cached.value);
    return;
  }

  // Falling back to a plain-string write for this key - same reasoning as
  // the transform case above: a value that toggles between the structured
  // shape and a plain string/other value across renders (e.g.
  // `width: cond() ? { value, unit } : '10px'`) would otherwise leave
  // `cache.units` holding a magnitude/unit that no longer matches what's
  // really on the element, since this write bypasses it entirely. Drop it
  // so the structured shape coming back later forces a real write instead
  // of wrongly concluding "unchanged" against stale bookkeeping.
  cache.units.delete(key);

  // {value, unit} but NOT CSSTOM-eligible (shorthand/custom property, or
  // this element has no attributeStyleMap) - serialize it to a plain CSS
  // string instead, since CSSTOM can't represent it either way.
  if (isUnitDescriptor) {
    const magnitude = resolveNumeric((value as NumericCSSProperty).value);
    const cssUnit = (value as NumericCSSProperty).unit;
    (node as HTMLElement).style.setProperty(key, `${magnitude}${unitToCssSuffix(cssUnit)}`);
    return;
  }

  // Everything else (plain CSS strings, colors, keywords, ...) - the
  // ordinary element.style path, same as before this renderer existed.
  if (isCamelCase(key)) ((node as HTMLElement).style as unknown as Record<string, unknown>)[key] = value;
  else (node as HTMLElement).style.setProperty(key, String(value));
}

// setProperty/removeProperty only take kebab-case names. The previous
// BaseComponent also accepted camelCase keys (`backgroundColor`) through
// `el.style[key]`, so those keep working the same way.
const UPPERCASE_RE = /[A-Z]/;
function isCamelCase(key: string): boolean {
  return UPPERCASE_RE.test(key);
}

function unsetProp(node: Element, cache: StyleCache, key: string): void {
  if (key === 'transform') cache.transform = undefined;
  cache.units.delete(key);
  if (cache.map && canUseTOM(key)) cache.map.delete(key);
  else if (isCamelCase(key)) ((node as HTMLElement).style as unknown as Record<string, unknown>)[key] = '';
  else (node as HTMLElement).style.removeProperty(key);
}

export function setStyleProperty(node: Element, name: string, value: unknown): void {
  const cache = getCache(node);
  if (value == null) unsetProp(node, cache, name);
  else setProp(node, cache, name, value);
}

export function style(
  node: Element,
  value: unknown,
  prev?: unknown
): Record<string, unknown> | unknown {
  if (!value) {
    if (prev) {
      resetStyleCache(node);
      node.removeAttribute('style');
    }
    return value;
  }

  if (typeof value === 'string') {
    resetStyleCache(node);
    (node as HTMLElement).style.cssText = value;
    return value;
  }

  const prevProps = (prev && typeof prev === 'object' ? prev : {}) as Record<string, unknown>;
  const nextProps = value as Record<string, unknown>;
  const cache = getCache(node);

  for (const key of Object.keys(prevProps)) {
    if (nextProps[key] == null) unsetProp(node, cache, key);
  }
  for (const key of Object.keys(nextProps)) {
    const next = nextProps[key];
    // A structured descriptor (NumericCSSProperty/TransformStyle) can carry
    // an un-invoked accessor, so it can keep the same object identity across
    // runs even though the accessor's value changed underneath it. Always
    // reprocess those - setProp's own per-property cache already skips the
    // actual native write when the resolved value hasn't changed, so this
    // only costs a comparison, not a wasted write.
    const isStructured = next !== null && typeof next === 'object';
    if (isStructured || next !== prevProps[key]) setProp(node, cache, key, next);
  }

  return nextProps;
}
