import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import selectors from "../../../shared/input-selectors.json";
import './input.css';
import NumberInput, { NumberInputRef } from "@components/Basic/Input/NumberInput/NumberInput";

const NumberInputTest = () => {
    let inputRef!: NumberInputRef;
    const [value, setValue] = createSignal<number | string>("");
    const [disabled, setDisabled] = createSignal(false);
    const [readonly, setReadonly] = createSignal(false);
    const [test, setTest] = createSignal(false);
    const [customBtn, setCustomBtn] = createSignal<string | null>(null)

    const scenarios = [
        { label: "Change input value with ref", action: () => inputRef?.changeValue(100) },
        { label: "Disable input", action: () => setDisabled(true) },
        { label: "Set readonly", action: () => setReadonly(true) },
        { label: "Change styles", action: () => setTest(true) },
        { label: "Increase", action: () => inputRef.increaseValue() },
        { label: "Decrease", action: () => inputRef.decreaseValue() },
        { label: "Enable custom button", action: () => setCustomBtn('Custom icon') },
    ];

    const reset = () => {
        setValue("");
        setDisabled(false);
        setTest(false);
        setReadonly(false);
        setCustomBtn(null);

        inputRef?.clear();
    };

    const isReactive = createMemo(() => test() === true);
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset))

    return (
        <Tab location='number-input'>
            <div class={selectors.assertionElement}>{value()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <div style={{'display': 'flex'}}>
                <NumberInput
                    onChange={(value) => setValue(value)} 
                    disabled={disabled()} 
                    class-disabled={selectors.inputDisabled}
                    ref={inputRef}
                    class={`${selectors.root} ${reactiveClass()}`}
                    min={-100}
                    max={100}
                    step={10}
                    readonly={readonly()}
                    style={reactiveStyle()}>
                    <NumberInput.Placeholder class={`${selectors.inputPlaceholder} ${reactiveClass()}`} style={reactiveStyle()}>50</NumberInput.Placeholder>
                    <NumberInput.Input class={`${selectors.input} ${reactiveClass()}`} style={reactiveStyle()}></NumberInput.Input>
                    <NumberInput.IncreaseControl 
                        class={`${selectors.inputIncreaseControl} ${reactiveClass()}`} 
                        style={reactiveStyle()}
                        position="after">
                            {customBtn()}
                        </NumberInput.IncreaseControl>
                    <NumberInput.DecreaseControl 
                        class={`${selectors.inputDecreaseControl} ${reactiveClass()}`} 
                        style={reactiveStyle()}
                        position="after"></NumberInput.DecreaseControl>
                </NumberInput>
            </div>
        </Tab>
    )
}

export default NumberInputTest;