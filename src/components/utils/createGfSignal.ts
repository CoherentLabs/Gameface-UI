import { createSignal } from "solid-js";

type Updater<T> = (prev: T) => T;

function isUpdater<T>(next: Exclude<T, Function> | Updater<T>): next is Updater<T> {
    return typeof next === 'function';
}

export function createGfSignal<T>(initial: () => T, onChange?: (v: T) => void) {
    const [value, setValue] = createSignal(initial);

    const set = (next: Exclude<T, Function> | Updater<T>) => {
        let change: { value: T } | undefined;

        setValue(prev => {
            const resolved = isUpdater(next) ? next(prev) : next;
            if (resolved !== prev) change = { value: resolved };
            return resolved;
        });

        if (change) onChange?.(change.value);
    };

    return [value, set] as const;
}
