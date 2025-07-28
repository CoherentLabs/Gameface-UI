import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import selectors from "../../../shared/input-selectors.json";
import PasswordInput, { PasswordInputRef } from "@components/Basic/Input/PasswordInput/PasswordInput";
import './input.css';

const PasswordInputTest = () => {
    let inputRef!: PasswordInputRef;
    const [value, setValue] = createSignal("");
    const [disabled, setDisabled] = createSignal(false);
    const [readonly, setReadonly] = createSignal(false);
    const [test, setTest] = createSignal(false);
    const [position, setPosition] = createSignal<'before' | 'after'>('after');

    const scenarios = [
        { label: "Change input value with ref", action: () => inputRef?.changeValue("100") },
        { label: "Disable input", action: () => setDisabled(true) },
        { label: "Set readonly", action: () => setReadonly(true) },
        { label: "Change styles", action: () => setTest(true) },
        { label: "Show password", action: () => inputRef.show() },
        { label: "Hide password", action: () => inputRef.hide() },
        { label: "Change button position", action: () => setPosition('before') },
    ];

    const reset = () => {
        setValue("");
        setDisabled(false);
        setTest(false);
        setReadonly(false);
        setPosition('after')
        inputRef?.clear();
        inputRef?.hide();
    };

    const isReactive = createMemo(() => test() === true);
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset))

    return (
        <Tab location='password-input'>
            <div class={selectors.assertionElement}>{value()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <div style={{'display': 'flex'}}>
                <PasswordInput
                    onChange={(value) => setValue(value)} 
                    disabled={disabled()} 
                    class-disabled={selectors.inputDisabled}
                    ref={inputRef}
                    class={`${selectors.root} ${reactiveClass()}`}
                    max-symbols={5}
                    readonly={readonly()}
                    style={reactiveStyle()}>
                    <PasswordInput.Before class={`${selectors.inputBefore} ${reactiveClass()}`} style={reactiveStyle()}>Before</PasswordInput.Before>
                    <PasswordInput.After class={`${selectors.inputAfter} ${reactiveClass()}`} style={reactiveStyle()}>After</PasswordInput.After>
                    <PasswordInput.Input class={`${selectors.input} ${reactiveClass()}`} style={reactiveStyle()}></PasswordInput.Input>
                    <PasswordInput.VisibilityButton 
                        position={position()} 
                        class={`${selectors.inputVisibilityButton} ${reactiveClass()}`} 
                        style={reactiveStyle()} />
                </PasswordInput>
            </div>
        </Tab>
    )
}

export default PasswordInputTest;