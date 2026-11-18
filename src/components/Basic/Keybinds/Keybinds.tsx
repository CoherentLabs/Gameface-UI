import { BaseComponentRef } from "@components/types/ComponentProps";
import { Accessor, createContext, createEffect, createMemo, createStore, onSettled, ParentComponent, StoreSetter, untrack } from "solid-js";
import {BindingCode, BindingLabel, MAPPINGS} from "./util/mappings";
import { GlyphOverrides  } from "./util/glyphs";
import { GLYPHS as DEFAULT_GLYPHS }  from "./util/glyphs";
import { GamepadMappings } from "coherent-gameface-interaction-manager";
import type { AxisInput, GamepadInput } from "coherent-gameface-interaction-manager";

export type Action = string;
export type KeyCode = BindingLabel | GamepadInput | (string & {}) | null;
export type ConflictPolicy = 'block' | 'replace-existing' | 'swap' | 'allow-duplicates'
export type Bindings = Record<Action, KeyCode>;

export interface KeybindsRef {
    bindings: Bindings,
    bind: (action: Action, newKey: KeyCode) => void,
    unbindKey: (key: KeyCode) => void,
    mapBindings: (bindings: Bindings) => void,
    clearAll: () => void,
    reset: () => void,
}

interface SharedProps {
    onChange?:  (prev: KeyCode, next: KeyCode, action: Action) => void,
    mode?: 'gamepad' | 'keyboard'
}

interface KeybindsContext extends SharedProps {
    KEYS: Record<BindingCode, string>,
    GLYPHS: GlyphOverrides,
    bindings: Bindings,
    bind: (action: Action, newKey: KeyCode) => boolean,
    placeholder?: Accessor<string | undefined>,
    listeningText?: Accessor<string | undefined>,
    useChars?: Accessor<boolean | undefined>,
}

// `null` default: Keybind warns when used outside Keybinds (pattern 1.3.o).
export const KeybindsContext = createContext<KeybindsContext | null>(null);

interface KeybindsProps extends SharedProps {
    defaults?: Bindings,
    overrides?: Partial<Record<BindingCode, string>>,
    placeholder?: string,
    listeningText?: string,
    conflictPolicy?: ConflictPolicy,
    glyphOverrides?: GlyphOverrides;
    ref?: unknown | ((ref: BaseComponentRef) => void);
    onConflict?: (action: Action, key: KeyCode, conflictAction: Action) => void,
}

const Keybinds: ParentComponent<KeybindsProps> = (props) => {
    // Read once at creation, as in 1.x.
    const KEYS = untrack(() => ({...MAPPINGS, ...props.overrides})); // { event.code: label }
    const DISPLAY_LABELS = new Set(Object.values(KEYS)); // Set of valid labels only
    const GLYPHS = untrack(() => ({... DEFAULT_GLYPHS, ...props.glyphOverrides }));

    // Solid 2 stages store writes (a read right after a write returns the old
    // value until the next microtask), but the binding logic below reads its
    // own writes in the same tick (clearAll + bind, swap, ...). So `now` is the
    // always-current plain copy the logic reads, and the store is only the
    // reactive view for rendering (Keybind labels). Same idea as Navigation's
    // navigationState.ts.
    const now: Bindings = {};
    // Created after the initial `defaults` are mapped (below): writing a store
    // during component setup throws in Solid 2.
    let setBindings: StoreSetter<Bindings> | undefined;
    const writeBinding = (action: Action, key: KeyCode) => {
        now[action] = key;
        setBindings?.((draft) => { draft[action] = key; });
    };

    let defaults = untrack(() => props.defaults);
    const byKey = new Map<KeyCode, Action>(); // reverse index

    const listeningText = createMemo(() => props.listeningText);
    const placeholder = createMemo(() => props.placeholder);

    createEffect(
        () => props.conflictPolicy,
        () => { mapBindings({ ...now }); },
        { defer: true }
    );

    const sanitizeButtonInput = (input: string | number | null) => {
        if (input === null) return null;
        
        const num = Number(input);
        if (!isNaN(num) || typeof input === 'number') {
            if (0 <= num && num <= 16) return String(input);
            else {
                console.warn(`${input} is not a valid gamepad button. Please ensure the number is between 0 and 16 inclusive`);
                return null
            }
        }

        const button = input.toLowerCase();
        if ((GamepadMappings.axisAliases as readonly string[]).includes(button)) return button as AxisInput;
        
        const key = GamepadMappings.aliases[button as keyof typeof GamepadMappings.aliases];
        if (key) return String(GamepadMappings[key]);

        console.warn(`${input} is not a valid gamepad button.`);
        return null;
    }

    const verifyKey = (key: string | null) => {
        if (key === null) return null;
        if (DISPLAY_LABELS.has(key)) return key;
        console.warn(`${key} is not a valid value. If you want to use custom key names, please provide them via the "overrides" prop`);
        return null;
    }

    const mapBindings = (next: Bindings) => {
        clearAll();
        for (const action in next) bind(action, next[action] ?? null);
    }

    const clearAll = () => {
        for (const action in now) writeBinding(action, null);
        byKey.clear();
    };

    const bind = (action: Action, newKey: KeyCode) => {
        const prevKey = now[action];
        if (prevKey === newKey) return false;

        newKey = props.mode === 'gamepad' 
            ? sanitizeButtonInput(newKey as GamepadInput) 
            : verifyKey(newKey as BindingLabel);

        const conflictAction = byKey.get(newKey);

        // no conflict -> just bind
        if (!conflictAction || conflictAction === action) {
            if (prevKey) byKey.delete(prevKey);
            writeBinding(action, newKey);
            if (newKey !== null) byKey.set(newKey, action);
            return true
        }

        switch (props.conflictPolicy) {
            case "block":
                console.warn(`${newKey} is already bound to ${conflictAction}, please unbind it first`);
                props.onConflict?.(action, newKey, conflictAction)
                return false;

            case "replace-existing":
                writeBinding(action, newKey);
                byKey.set(newKey, action);

                // unbind conflict
                writeBinding(conflictAction, null);
                if (prevKey) byKey.delete(prevKey);
                props.onConflict?.(action, newKey, conflictAction)
                return true;

            case "swap":
                writeBinding(action, newKey);
                writeBinding(conflictAction, prevKey);

                byKey.set(newKey, action);
                if (prevKey) byKey.set(prevKey, conflictAction);
                props.onConflict?.(action, newKey, conflictAction)
                return true;

            default: // allow-duplicates
                writeBinding(action, newKey);
                props.onConflict?.(action, newKey, conflictAction)
                return true;
        }
    }

    const unbindKey = (key: KeyCode) => {
        if (key === null) return;

        let success = byKey.delete(key);
        for (const action in now) {
            if (now[action] === key) {
                writeBinding(action as Action, null);
                if (success) {
                    props.onChange?.(key, null, action);
                }
            }
        }
    }

    const userBind = (action: Action, newKey: KeyCode) => {
        const prevKey = now[action] || null;
        const success = bind(action, newKey);
        if (success) props.onChange?.(prevKey, newKey, action);
    }

    const reset = () => mapBindings({...defaults});

    const getRawObject = () => ({ ...now });

    // initialize with defaults if provided (only `now` is written here; the
    // store is created from it right after)
    if (defaults) {
        const initial = defaults;
        untrack(() => mapBindings({ ...initial }));
        defaults = getRawObject();
    // else children will init themselves
    } else {
        queueMicrotask(() => defaults = getRawObject());
    }

    const [bindings, setStore] = createStore<Bindings>({ ...now });
    setBindings = setStore;

    // Keybinds renders no element, so the ref gets only the API (onSettled so
    // a ref callback may write signals).
    onSettled(() => {
        if (typeof props.ref === 'function') {
            props.ref({
                get bindings() { return getRawObject(); },
                mapBindings,
                bind: userBind,
                unbindKey,
                clearAll,
                reset
            });
        }
    });

    const contextValue = {
        bindings,
        bind,
        listeningText,
        placeholder,
        KEYS,
        GLYPHS,
        get onChange() { return props.onChange; },
        get mode() { return props.mode; },
    }

    return (
        <KeybindsContext value={contextValue} >
            {props.children}
        </KeybindsContext>
    )
}

export default Keybinds;