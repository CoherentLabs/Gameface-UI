import { BaseComponentRef } from "@components/types/ComponentProps";
import { batch, createContext, onMount, ParentComponent } from "solid-js";
import { createStore, unwrap } from "solid-js/store";

export type Action = string;
export type KeyCode = string | null; // e.g. 'KeyW', 'ArrowUp', etc. Use KeyboardEvent.code ideally.
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
    bindings: Bindings,
    bind: (action: Action, newKey: KeyCode) => void,
    placeholder?: string,
    listeningText?: string,
    useChars?: boolean
    onChange?:  (action: Action, key: KeyCode) => void,
}

export const KeybindsContext = createContext<KeybindsContext>();

interface KeybindsProps {
    defaults?: Bindings,
    placeholder?: string,
    listeningText?: string,
    useChars?: boolean,
    conflictPolicy?: ConflictPolicy,
    ref?: unknown | ((ref: BaseComponentRef) => void);
    onConflict?: (action: Action, key: KeyCode, conflictAction: Action) => void,
    onChange?: (action: Action, key: KeyCode) => void,
}

const Keybinds: ParentComponent<KeybindsProps> = (props) => {
    const [bindings, setBindings] = createStore<Bindings>({});
    let defaults = props.defaults ?? undefined;
    const byKey = new Map<KeyCode, Action>(); // reverse index

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
        if (prevKey === newKey) return;

        const conflictAction = byKey.get(newKey);

        // no conflict -> just bind
        if (!conflictAction || conflictAction === action) {
            if (prevKey) byKey.delete(prevKey);
            setBindings(action, newKey);
            if (newKey !== null) byKey.set(newKey, action);
            return
        }

        switch (props.conflictPolicy) {
            case "block":
                console.warn(`${newKey} is already bound to ${conflictAction}, please unbind it first`);
                if (!prevKey) setBindings(action, null);
                break;

            case "replace-existing":
                setBindings(action, newKey);
                byKey.set(newKey, action);

                // unbind conflict
                setBindings(conflictAction, null);
                if (prevKey) byKey.delete(prevKey);
                break;

            case "swap":
                setBindings(action, newKey);
                setBindings(conflictAction, prevKey);

                byKey.set(newKey, action);
                if (prevKey) byKey.set(prevKey, conflictAction);
                break;

            default:
                setBindings(action, newKey);
                break;
        }

        props.onConflict?.(action, newKey, conflictAction)
    }

    const unbindKey = (key: KeyCode) => {
        if (key == null) return;

        byKey.delete(key);
        batch(() => {
            for (const action in bindings) {
                if (bindings[action] === key) {
                    setBindings(action as Action, null);
                }
            }
        });
    }

    const reset = () => mapBindings({...defaults});

    const getRawObject = () => unwrap(bindings)

    onMount(() => {
        if (props.ref) {
            (props.ref as (ref: any) => void)({
                bindings: getRawObject(),
                mapBindings,
                bind,
                unbindKey,
                clearAll,
                reset
            });
        }
        // initialize with defaults if provided
        if (defaults) mapBindings({...defaults});
        else queueMicrotask(() => defaults = {...getRawObject()});
    });

    const contextValue = {
        bindings,
        bind,
        useChars: props.useChars,
        listeningText: props.listeningText,
        placeholder: props.placeholder,
        onChange: props.onChange
    }

    return (
        <KeybindsContext.Provider value={contextValue} >
            {props.children}
        </KeybindsContext.Provider>
    )
}

export default Keybinds;