import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import Radio, { RadioRef } from "@components/Basic/RadioGroup/Radio";
import './radio.css';

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
            <div class="assertion-element">{selected()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`scenario-btn scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <Radio 
                onChange={(selected) => setSelected(selected)} 
                disabled={disabled()} 
                class-disabled="radio-disabled" 
                ref={radioRef}
                class={`radio ${reactiveClass()}`}
                style={reactiveStyle()} >
                    <For each={radioButtons}>
                        {(button, index) => (
                            <Radio.Button 
                                selected={button.selected} 
                                value={button.value + index()} 
                                disabled={disabledBtn()}
                                class-disabled="radio-button-disabled"
                                class={`radio-button radio-button${index()} ${reactiveClass()}`}
                                style={reactiveStyle()}>
                                <Radio.ButtonControl 
                                    class={`radio-control${index()} ${reactiveClass()}`}
                                    style={reactiveStyle()}>
                                        <Radio.ButtonIndicator 
                                            class={`radio-indicator${index()} ${reactiveClass()}`}
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