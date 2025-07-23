import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import selectors from "../../../shared/input-selectors.json";
import TextInput from "@components/Basic/Input/TextInput/TextInput";
import { TextInputRef } from "@components/Basic/Input/shared/types";
import './input.css';

const TextInputTest = () => {
    let inputRef!: TextInputRef;
    const [value, setValue] = createSignal("");
    const [disabled, setDisabled] = createSignal(false);
    const [readonly, setReadonly] = createSignal(false);
    const [test, setTest] = createSignal(false);

    const scenarios = [
        { label: "Change input value with ref", action: () => inputRef?.changeValue("100") },
        { label: "Disable input", action: () => setDisabled(true) },
        { label: "Set readonly", action: () => setReadonly(true) },
        { label: "Change styles", action: () => setTest(true) },
    ];

    const reset = () => {
        setValue("");
        setDisabled(false);
        setTest(false);
        setReadonly(false);
        inputRef?.clear();
    };

    const isReactive = createMemo(() => test() === true);
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset))

    return (
        <Tab location='text-input'>
            <div class={selectors.assertionElement}>{value()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <div style={{'display': 'flex'}}>
                <TextInput
                    onChange={(value) => setValue(value)} 
                    disabled={disabled()} 
                    class-disabled={selectors.inputDisabled}
                    ref={inputRef}
                    class={`${selectors.root} ${reactiveClass()}`}
                    max-symbols={5}
                    readonly={readonly()}
                    style={reactiveStyle()}>
                    <TextInput.Before class={`${selectors.inputBefore} ${reactiveClass()}`} style={reactiveStyle()}>Before</TextInput.Before>
                    <TextInput.After class={`${selectors.inputAfter} ${reactiveClass()}`} style={reactiveStyle()}>After</TextInput.After>
                    <TextInput.Input class={`${selectors.input} ${reactiveClass()}`} style={reactiveStyle()}></TextInput.Input>
                    <TextInput.Placeholder class={`${selectors.inputPlaceholder} ${reactiveClass()}`} style={reactiveStyle()}>Placeholder</TextInput.Placeholder>
                </TextInput>
            </div>
        </Tab>
    )
}

export default TextInputTest;