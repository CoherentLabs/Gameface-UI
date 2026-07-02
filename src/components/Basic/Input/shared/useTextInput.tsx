import { createEffect, createSignal, on, onCleanup } from "solid-js";
import { TextInputProps } from "./types";
import { debounce } from "@components/utils/debounce";
import { DEFAULT_DELAY } from "./constants";

function useTextInput (props: TextInputProps) {
    const [value, setValue] = createSignal<string>(props.value ?? '');

    // Synchronize internal value with props.value changes
    createEffect(on(() => props.value ?? "", (newValue) => {
        if (!exceedsMaxSymbols(newValue)) setValue(newValue);
    }, { defer: true }));

    const exceedsMaxSymbols = (newValue: string) => {
        const maxSymbols = props['max-symbols'];

        if (!maxSymbols) return false;
        return newValue.length > maxSymbols;
    }

    const delayUpdate = debounce((newValue: string) =>
        props.onChange?.(newValue), typeof props.delay === 'number' ? props.delay : DEFAULT_DELAY);

    const applyValue = (newValue: string) => {
        delayUpdate.cancel(); // drop any pending debounced onChange so this synchronous value wins
        setValue(newValue);
        props.onChange?.(newValue);
    };

    const handleChange = (e: InputEvent) => {
        if (!e.target ) return;

        const input = e.target as HTMLInputElement;
        const newValue = input.value;

        if (props.readonly) {
            input.value = value();
            return
        }

        if (exceedsMaxSymbols(newValue)) {
            input.value = value();
            return
        };
        
        setValue(newValue);
        props.delay ? delayUpdate(newValue) : props.onChange?.(newValue);
    }

     const changeValue = (newVal: string) => {
        if (exceedsMaxSymbols(newVal)) return;

        applyValue(newVal);
    };

    const clear = () => changeValue('');

    onCleanup(() => delayUpdate.cancel());

    return {
        value,
        handleChange,
        changeValue,
        clear,
    };
}

export default useTextInput;