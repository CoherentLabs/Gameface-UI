import { untrack } from 'solid-js';
import type { RefCallback } from '@components/BaseComponent/BaseComponent';

type RefTarget = ((value: any) => void) | ReadonlyArray<RefTarget> | unknown;

function callRef(ref: RefTarget, value: unknown) {
    if (typeof ref === 'function') ref(value);
    else if (Array.isArray(ref)) ref.forEach((r) => callRef(r, value));
}

/**
 * Ref factory that hands a component's public API to the consumer's `ref` prop.
 * Use it in the element's ref array next to `baseComponent(props)`:
 *
 *   <div ref={[baseComponent(props), exposeRef<CheckboxRef>(props, {
 *       checked,
 *       setChecked,
 *       get value() { return props.value; },
 *   })]}>
 *
 * - Without `api` the consumer receives the element itself.
 * - With `api` the consumer receives the same object with `element` added.
 *   Use getters for values that must stay current (no snapshot, no `untrack`).
 * - `api` can also be a function that returns the object (or `undefined` to
 *   fall back to the element), e.g. `() => props.refObject` in LayoutBase.
 *
 * It only reads `props.ref` and never writes to props, so it keeps working when
 * props arrive through a spread, `merge` or `omit` (see the migration notes).
 */
export default function exposeRef<T extends object>(
    props: { ref?: unknown },
    api?: T | (() => T | undefined)
): RefCallback<HTMLElement> {
    // Ref callbacks run once, so read `ref` / `api` untracked (an intentional
    // one-time read; avoids Solid 2's STRICT_READ_UNTRACKED dev warning when
    // they arrive as getters through a spread).
    return (el) => untrack(() => {
        const ref = props.ref;
        if (!ref) return;

        const value = typeof api === 'function' ? (api as () => T | undefined)() : api;
        if (!value) {
            callRef(ref, el);
            return;
        }

        // Add `element` to the API object itself (rather than spreading it) so
        // getters on the object keep working for the consumer.
        callRef(ref, Object.assign(value, { element: el }));
    });
}
