import { BaseComponentRef } from "@components/types/ComponentProps";
import { batch, createContext, onMount, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

export type Action = string;
export type KeyCode = string | null; // e.g. 'KeyW', 'ArrowUp', etc. Use KeyboardEvent.code ideally.
export type ConflictPolicy = 'block' | 'replace-existing' | 'swap' | 'allow-duplicates'
type Bindings = Record<Action, KeyCode>;

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
    defaults?: Bindings[], // discuss with misho if I should even have this property, cuz idk how it will work with the usage of the Keybind component?
    placeholder?: string,
    listeningText?: string,
    useChars?: boolean,
    conflictPolicy?: ConflictPolicy,
    ref?: unknown | ((ref: BaseComponentRef) => void);
    onConflict?: (action: Action, key: KeyCode, conflictAction: Action, conflictKey: KeyCode) => void,
    onChange?: (action: Action, key: KeyCode) => void,
}

const Keybinds: ParentComponent<KeybindsProps> = (props) => {
    const [bindings, setBindings] = createStore<Bindings>({});
    const byKey = new Map<KeyCode, Action>(); // reverse index

    const bind = (action: Action, newKey: KeyCode) => {
        if (newKey === null) return;

        const prevKey = bindings[action];
        if (prevKey === newKey) return; // no-op

        const conflictAction = byKey.get(newKey);

        // no conflict → just bind
        if (!conflictAction || conflictAction === action) {
            if (prevKey) byKey.delete(prevKey);
            setBindings(action, newKey);
            byKey.set(newKey, action);
            return true;
        }

        switch (props.conflictPolicy) {
            case "block":
                console.warn(`${newKey} is already bound to ${conflictAction}, please unbind it first`);
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
                else byKey.delete(prevKey);
                break;

            case "allow-duplicates":
                setBindings(action, newKey);
                break;
        }

        props.onConflict?.(action, newKey, conflictAction, prevKey)
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

    const contextValue = {
        bindings,
        bind,
        useChars: props.useChars,
        listeningText: props.listeningText,
        placeholder: props.placeholder,
        onChange: props.onChange
    }

    onMount(() => {
        if (props.ref) {
            (props.ref as (ref: any) => void)({
                bindings,
                bind,
                unbindKey,
            });
        }
    });

    return (
        <KeybindsContext.Provider value={contextValue} >
            {props.children}
        </KeybindsContext.Provider>
    )
}

export default Keybinds;