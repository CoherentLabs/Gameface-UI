import { BaseComponentRef } from "@components/types/ComponentProps";
import { Accessor, batch, createContext, createEffect, createMemo, on, onMount, ParentComponent } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import {BindingCode, BindingLabel, MAPPINGS} from "./util/mappings";

export type Action = string;
export type KeyCode = BindingLabel | (string & {}) | null;
export type ConflictPolicy = 'block' | 'replace-existing' | 'swap' | 'allow-duplicates'
type Bindings = Record<Action, KeyCode>;

export interface KeybindsRef {
    bindings: Bindings,
    bind: (action: Action, newKey: KeyCode) => void,
    unbindKey: (key: KeyCode) => void,
    mapBindings: (bindings: Bindings) => void,
    clearAll: () => void,
    reset: () => void,
}

interface KeybindsContext {
    KEYS: Record<BindingCode, string>,
    bindings: Bindings,
    bind: (action: Action, newKey: KeyCode) => boolean,
    placeholder?: Accessor<string | undefined>,
    listeningText?: Accessor<string | undefined>,
    useChars?: Accessor<boolean | undefined>
    onChange?:  (prev: KeyCode, next: KeyCode, action: Action) => void,
}

export const KeybindsContext = createContext<KeybindsContext>();

interface KeybindsProps {
    defaults?: Bindings,
    overrides?: Partial<Record<BindingCode, string>>,
    placeholder?: string,
    listeningText?: string,
    conflictPolicy?: ConflictPolicy,
    ref?: unknown | ((ref: BaseComponentRef) => void);
    onConflict?: (action: Action, key: KeyCode, conflictAction: Action) => void,
    onChange?:  (prev: KeyCode, next: KeyCode, action: Action) => void,
}

const Keybinds: ParentComponent<KeybindsProps> = (props) => {
    const KEYS = {...MAPPINGS, ...props.overrides}; // { event.code: label }
    const DISPLAY_LABELS = new Set(Object.values(KEYS)); // Set of valid labels only

    const [bindings, setBindings] = createStore<Bindings>({});
    let defaults = props.defaults ?? undefined;
    const byKey = new Map<KeyCode, Action>(); // reverse index

    const listeningText = createMemo(() => props.listeningText);
    const placeholder = createMemo(() => props.placeholder);

    createEffect(on(() => props.conflictPolicy, () => {
        mapBindings({...bindings})
    }, {defer: true}));

    const verifyKey = (key: string | null) => {
        if (key === null) return null;
        if (DISPLAY_LABELS.has(key)) return key;
        console.warn(`${key} is not a valid value. If you want to use custom key names, please provide them via the "overrides" prop`);
        return null;
    }

    const mapBindings = (next: Bindings) => {
        batch(() => {
            clearAll();
            for (const action in next) bind(action, next[action] ?? null);
        });
    }

     const clearAll = () => {
        for (const action in bindings) setBindings(action, null);
        byKey.clear();
    };

    const bind = (action: Action, newKey: KeyCode) => {
        const prevKey = bindings[action];
        if (prevKey === newKey) return false;

        const conflictAction = byKey.get(newKey);

        // no conflict -> just bind
        if (!conflictAction || conflictAction === action) {
            if (prevKey) byKey.delete(prevKey);
            const verifiedKey = verifyKey(newKey);
            setBindings(action, verifiedKey);
            if (verifiedKey !== null) byKey.set(newKey, action);
            return true
        }

        switch (props.conflictPolicy) {
            case "block":
                console.warn(`${newKey} is already bound to ${conflictAction}, please unbind it first`);
                props.onConflict?.(action, newKey, conflictAction)
                return false;

            case "replace-existing":
                setBindings(action, newKey);
                byKey.set(newKey, action);

                // unbind conflict
                setBindings(conflictAction, null);
                if (prevKey) byKey.delete(prevKey);
                props.onConflict?.(action, newKey, conflictAction)
                return true;

            case "swap":
                setBindings(action, newKey);
                setBindings(conflictAction, prevKey);

                byKey.set(newKey, action);
                if (prevKey) byKey.set(prevKey, conflictAction);
                props.onConflict?.(action, newKey, conflictAction)
                return true;

            default: // allow-duplicates
                setBindings(action, newKey);
                props.onConflict?.(action, newKey, conflictAction)
                return true;
        }
    }

    const unbindKey = (key: KeyCode) => {
        if (key === null) return;

        let success = byKey.delete(key);
        batch(() => {
            for (const action in bindings) {
                if (bindings[action] === key) {
                    setBindings(action as Action, null);
                    if (success) {
                        props.onChange?.(key, null, action);
                    }
                }
            }
        });
    }

    const userBind = (action: Action, newKey: KeyCode) => {
        const prevKey = bindings[action] || null;
        const success = bind(action, newKey);
        if (success) props.onChange?.(prevKey, newKey, action);
    }

    const reset = () => mapBindings({...defaults});

    const getRawObject = () => unwrap(bindings)

    // initialize with defaults if provided
    if (defaults) {
        mapBindings({ ...defaults });
        defaults = { ...getRawObject() };
    // else children will init themselves
    } else { 
        queueMicrotask(() => defaults = {...getRawObject()});
    }

    onMount(() => {
        if (props.ref) {
            (props.ref as (ref: any) => void)({
                bindings: getRawObject(),
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
        onChange: props.onChange
    }

    return (
        <KeybindsContext.Provider value={contextValue} >
            {props.children}
        </KeybindsContext.Provider>
    )
}

export default Keybinds;