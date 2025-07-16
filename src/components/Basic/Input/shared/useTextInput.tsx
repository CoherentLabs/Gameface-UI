import { createSignal } from "solid-js";
import { TextInputProps } from "./types";

function useTextInput (props: TextInputProps) {
    const [value, setValue] = createSignal<string>(props.value ?? '');

    const handleChange = (e: InputEvent) => {
        if (props.readonly || !e.target ) return;

        const input = e.target as HTMLInputElement;
        const newValue = input.value;

        if (props['max-symbols'] && newValue.length > props['max-symbols']) {
            input.value = value();
            return
        };
        
        setValue(newValue);
        props.onChange?.(newValue);
    }

     const changeValue = (newVal: string) => {
        if (props['max-symbols'] && newVal.length > props['max-symbols']) return;
        setValue(newVal);
        props.onChange?.(newVal);
    };

    const clear = () => changeValue('');

    return {
        value,
        handleChange,
        changeValue,
        clear,
    };
}

export default useTextInput;