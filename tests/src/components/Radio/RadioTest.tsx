import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import Radio, { RadioRef } from "@components/Basic/RadioGroup/Radio";
import './radio.css';
import selectors from "../../../shared/radio-selectors.json";

const radioButtons = [
    { value: 'test', selected: true, isBefore: false},
    { value: 'test', selected: false, isBefore: true},
    { value: 'test', selected: false, isBefore: false}
]

const RadioTest = () => {
    let radioRef!: RadioRef;
    const [selected, setSelected] = createSignal("");
    const [disabled, setDisabled] = createSignal(false);
    const [disabledBtn, setDisabledBtn] = createSignal(false);

    const scenarios = [
        { label: "Select option with ref", action: () => radioRef?.changeOption("test2") },
        { label: "Disable entire radio", action: () => setDisabled(true) },
        { label: "Disable buttons", action: () => setDisabledBtn(true) },
    ];

    const resetRadio = () => {
        setDisabled(false);
        setDisabledBtn(false);
        radioRef?.changeOption('test0')
    };

    const isReactive = createMemo(() => selected() === 'test1');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', resetRadio))
    onCleanup(() => document.removeEventListener('reset', resetRadio)) 

    return (
        <Tab location='radio'>
            <div class={selectors.assertionElement}>{selected()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <Radio 
                onChange={(selected) => setSelected(selected)} 
                disabled={disabled()} 
                class-disabled={selectors.radioDisabled}
                ref={radioRef}
                class={`${selectors.radio} ${reactiveClass()}`}
                style={reactiveStyle()} >
                    <For each={radioButtons}>
                        {(button, index) => (
                            <Radio.Button 
                                selected={button.selected} 
                                value={button.value + index()} 
                                disabled={disabledBtn()}
                                class-disabled={selectors.radioButtonDisabled}
                                class={`${selectors.radioButton} ${selectors.radioButton}${index()} ${reactiveClass()}`}
                                style={reactiveStyle()}>
                                <Radio.ButtonControl 
                                    class={`${selectors.radioControl}${index()} ${reactiveClass()}`}
                                    style={reactiveStyle()}>
                                        <Radio.ButtonIndicator 
                                            class={`${selectors.radioIndicator}${index()} ${reactiveClass()}`}
                                            style={reactiveStyle()}></Radio.ButtonIndicator>
                                    </Radio.ButtonControl>
                                <Radio.ButtonLabel before={button.isBefore}>{button.value + index()}</Radio.ButtonLabel>
                            </Radio.Button>
                        )}
                    </For>
            </Radio>
            
        </Tab>
    )
}

export default RadioTest;