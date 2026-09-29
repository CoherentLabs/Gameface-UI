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
import type { NumericCSSProperty, TransformStyle } from '@components/types';
import { canUseTOM, defaultUnitFor, unitToCssSuffix } from './tom-constants';

function resolveNumeric(value: Accessor<number> | number): number {
  return typeof value === 'function' ? value() : value;
}

function transformDescriptorToCss(next: TransformStyle): string {
  const translateX = resolveNumeric(next.translateX.value);
  const translateY = resolveNumeric(next.translateY.value);
  const scaleX = resolveNumeric(next.scaleX);
  const scaleY = resolveNumeric(next.scaleY);
  const rotate = resolveNumeric(next.rotate);

  const parts: string[] = [];
  if (translateX || translateY) {
    parts.push(`translate(${translateX}${unitToCssSuffix(next.translateX.unit)}, ${translateY}${unitToCssSuffix(next.translateY.unit)})`);
  }
  if (scaleX !== 1 || scaleY !== 1) parts.push(`scale(${scaleX}, ${scaleY})`);
  if (rotate) parts.push(`rotate(${rotate}deg)`);
  const skewX = resolveNumeric(next.skewX ?? 0);
  const skewY = resolveNumeric(next.skewY ?? 0);
  if (skewX || skewY) parts.push(`skew(${skewX}deg, ${skewY}deg)`);
  return parts.join(' ');
}

interface TransformCache {
  value: CSSTransformValue;
  translate: CSSTranslate;
  translateX: CSSUnitValue;
  translateXUnit: string;
  translateY: CSSUnitValue;
  translateYUnit: string;
  scale: CSSScale;
  angle: CSSUnitValue;
  skewXComp: CSSSkewX;
  skewYComp: CSSSkewY;
  skewX: CSSUnitValue;
  skewY: CSSUnitValue;
  // last applied primitive values - lets applyTransform skip a leaf mutation
  // (and the map.set() call entirely) when nothing actually moved, even
  // though `next` is a fresh object literal every reactive run.
  prev: { translateX: number; translateY: number; scaleX: number; scaleY: number; rotate: number; skewX: number; skewY: number };
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

function getTransformCache(cache: StyleCache): TransformCache {
  if (cache.transform) return cache.transform;

  const translate = new CSSTranslate(new CSSUnitValue(0, 'px'), new CSSUnitValue(0, 'px'));
  const scale = new CSSScale(1, 1);
  const rotate = new CSSRotate(new CSSUnitValue(0, 'deg'));
  const skewXComp = new CSSSkewX(new CSSUnitValue(0, 'deg'));
  const skewYComp = new CSSSkewY(new CSSUnitValue(0, 'deg'));

  return (cache.transform = {
    value: new CSSTransformValue([translate, scale, rotate, skewXComp, skewYComp]),
    translate,
    translateX: translate.x as CSSUnitValue, translateXUnit: 'px',
    translateY: translate.y as CSSUnitValue, translateYUnit: 'px',
    scale,
    angle: rotate.angle as CSSUnitValue,
    skewXComp, skewYComp,
    skewX: skewXComp.ax as CSSUnitValue,
    skewY: skewYComp.ay as CSSUnitValue,
    prev: { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, rotate: 0, skewX: 0, skewY: 0 }
  });
}

function applyTransform(map: StylePropertyMap, cache: StyleCache, next: TransformStyle): void {
  const t = getTransformCache(cache);
  const p = t.prev;
  let changed = false;

  const translateX = resolveNumeric(next.translateX.value);
  if (next.translateX.unit !== t.translateXUnit) {
    t.translate.x = new CSSUnitValue(translateX, next.translateX.unit);
    t.translateX = t.translate.x as CSSUnitValue;
    t.translateXUnit = next.translateX.unit;
    p.translateX = translateX;
    changed = true;
  } else if (translateX !== p.translateX) {
    t.translateX.value = p.translateX = translateX;
    changed = true;
  }

  const translateY = resolveNumeric(next.translateY.value);
  if (next.translateY.unit !== t.translateYUnit) {
    t.translate.y = new CSSUnitValue(translateY, next.translateY.unit);
    t.translateY = t.translate.y as CSSUnitValue;
    t.translateYUnit = next.translateY.unit;
    p.translateY = translateY;
    changed = true;
  } else if (translateY !== p.translateY) {
    t.translateY.value = p.translateY = translateY;
    changed = true;
  }

  const scaleX = resolveNumeric(next.scaleX);
  if (scaleX !== p.scaleX) { t.scale.x = p.scaleX = scaleX; changed = true; }

  const scaleY = resolveNumeric(next.scaleY);
  if (scaleY !== p.scaleY) { t.scale.y = p.scaleY = scaleY; changed = true; }

  const rotate = resolveNumeric(next.rotate);
  if (rotate !== p.rotate) { t.angle.value = p.rotate = rotate; changed = true; }

  const skewX = resolveNumeric(next.skewX ?? 0);
  if (skewX !== p.skewX) { t.skewX.value = p.skewX = skewX; changed = true; }

  const skewY = resolveNumeric(next.skewY ?? 0);
  if (skewY !== p.skewY) { t.skewY.value = p.skewY = skewY; changed = true; }

  if (changed) map.set('transform', t.value);
}

function setProp(node: Element, cache: StyleCache, key: string, value: unknown): void {
  if (key === 'transform' && value && typeof value === 'object') {
    if (cache.map) applyTransform(cache.map, cache, value as TransformStyle);
    else (node as HTMLElement).style.setProperty('transform', transformDescriptorToCss(value as TransformStyle));
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
  (node as HTMLElement).style.setProperty(key, String(value));
}

function unsetProp(node: Element, cache: StyleCache, key: string): void {
  if (key === 'transform') cache.transform = undefined;
  cache.units.delete(key);
  if (cache.map && canUseTOM(key)) cache.map.delete(key);
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
    if (prev) node.removeAttribute('style');
    return value;
  }

  if (typeof value === 'string') {
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
    if (next !== prevProps[key]) setProp(node, cache, key, next);
  }

  return nextProps;
}
