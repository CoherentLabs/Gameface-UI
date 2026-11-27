import { batch, createComputed, createEffect, createMemo, createSignal, on, untrack } from 'solid-js';
import type { StateGroup, StateGroupApi } from './types';
import { scheduleModelSync } from './modelSync';

/** Internal: dev hooks force a state (the editor's Live states); it wins over the driver until the next change. */
export const FORCE = Symbol('flow.force');
/** Internal: change listener that also says whether the change came from FORCE. */
export const OBSERVE = Symbol('flow.observe');

export interface InternalStateGroup extends StateGroupApi {
    [FORCE](state: string): boolean;
    [OBSERVE](fn: (next: string, prev: string, forced: boolean) => void): () => void;
}

/**
 * One state group. `current` is, in order: a state forced by the editor, the driver's state
 * (state as prop, or the first following state whose condition is true), the last state `set`, the initial state.
 */
export function createStateGroup(def: StateGroup, driver?: () => string | undefined): StateGroupApi {
    return createInternalStateGroup(def, driver);
}

export function createInternalStateGroup(def: StateGroup, driver?: () => string | undefined): InternalStateGroup {
    const names = def.states.map((s) => s.name);
    const follows = new Set(def.states.filter((s) => s.showWhen).map((s) => s.name));
    const known = (state: string) => names.includes(state);

    let initial = def.initial;
    if (!known(initial)) {
        console.warn(`[Flow] State group "${def.name}": initial state "${initial}" doesn't exist, using "${names[0]}".`);
        initial = names[0] ?? '';
    }

    const [manual, setManual] = createSignal(initial);
    const [forced, setForced] = createSignal<string | undefined>(undefined);

    const driven = createMemo(() => {
        const value = driver?.();
        if (value === undefined || value === null) return undefined;
        if (!known(value)) {
            console.warn(`[Flow] State group "${def.name}": the driver returned unknown state "${value}".`);
            return undefined;
        }
        return value;
    });

    // Last change wins: a driver change ends a forced state.
    createComputed(on(driven, () => setForced(undefined), { defer: true }));

    const current = createMemo(() => forced() ?? driven() ?? manual());

    const listeners = new Set<(next: string, prev: string, forced: boolean) => void>();
    let prev = untrack(current);
    createEffect(on(current, (next) => {
        if (next === prev) return;
        const from = prev;
        prev = next;
        // Elements a <Show> on this group just mounted need a sync before their bindings fill.
        scheduleModelSync();
        const byForce = forced() === next;
        for (const fn of [...listeners]) fn(next, from, byForce);
    }, { defer: true }));

    const observe = (fn: (next: string, prev: string, forced: boolean) => void) => {
        listeners.add(fn);
        return () => { listeners.delete(fn); };
    };

    return {
        name: def.name,
        current,
        is: (...states: string[]) => states.includes(current()),
        set(state: string) {
            if (!known(state)) {
                console.warn(`[Flow] State group "${def.name}" has no state "${state}".`);
                return;
            }
            if (follows.has(state)) {
                console.warn(`[Flow] State "${def.name}:${state}" follows a condition and can't be set.`);
                return;
            }
            batch(() => {
                setForced(undefined);
                setManual(state);
            });
        },
        onEnter(state: string, fn: () => void) {
            return observe((next) => { if (next === state) fn(); });
        },
        onChange(fn: (next: string, prev: string) => void) {
            return observe((next, from) => fn(next, from));
        },
        [FORCE](state: string) {
            if (!known(state)) return false;
            setForced(state);
            return true;
        },
        [OBSERVE]: observe,
    };
}
