import type { TypedOMUnit } from '@components/types';

// scripts/babel/style-tom-plugin.mts keeps its own copy of these two lists,
// so the plugin can load (and switch itself off) without this file.
export const UNITLESS_PROPS = new Set([
  'opacity', 'z-index', 'flex-grow', 'flex-shrink', 'line-height'
]);

// https://docs.coherent-labs.com/cpp-gameface/content_development/csstypedobjectmodel/#supported-subset
export const SUPPORTED_PROPS = new Set([
  'border-bottom-width', 'border-left-width', 'border-right-width', 'border-top-width',
  'bottom', 'top', 'left', 'right', 'width', 'height',
  'flex-basis', 'flex-grow', 'flex-shrink',
  'font-size', 'letter-spacing', 'line-height',
  'margin-bottom', 'margin-left', 'margin-right', 'margin-top',
  'max-height', 'max-width', 'min-height', 'min-width',
  'opacity', 'z-index',
  'padding-bottom', 'padding-left', 'padding-right', 'padding-top',
  'text-decoration-thickness', 'text-stroke-width', 'text-underline-offset'
]);

export function canUseTOM(key: string): boolean {
  return SUPPORTED_PROPS.has(key);
}

// CSS Typed OM's 'percent'/'number' aren't valid CSS text - only relevant
// when serializing back to a plain string (non-CSSTOM elements).
export function unitToCssSuffix(u: TypedOMUnit): string {
  if (u === 'percent') return '%';
  if (u === 'number') return '';
  return u;
}

// Default unit for a bare JS `number` on a given property - there's no
// string to inspect for a suffix here (unlike the plugin's string-parsing
// case below), so this is the only place a default is still reasonable:
// `style={{ opacity: o() }}` / `style={{ left: 10 }}` carry no unit
// information at all, and the property still needs one to build a
// CSSUnitValue.
export function defaultUnitFor(key: string): TypedOMUnit {
  return UNITLESS_PROPS.has(key) ? 'number' : 'px';
}
