import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import Stepper, { StepperRef } from "@components/Basic/Stepper/Stepper";
import './stepper.css';
import selectors from "../../../shared/stepper-selectors.json";

const stepperOptions = [
    { value: 'test0', selected: true, isBefore: false},
    { value: 'test1', selected: false, isBefore: true},
    { value: 'test2', selected: false, isBefore: false}
]

const StepperTest = () => {
    let stepperRef!: StepperRef;
    const [selected, setSelected] = createSignal("");
    const [disabled, setDisabled] = createSignal(false);
    const [shouldLoop, setShouldLoop] = createSignal(false);
    const [position, setPosition] = createSignal<"before" | "after" | undefined>(undefined);
    const [customBtn, setCustomBtn] = createSignal(false);

    const scenarios = [
        { label: "Select option with ref", action: () => stepperRef?.setOption("test1") },
        { label: "Disable entire stepper", action: () => setDisabled(true) },
        { label: "Enable loop", action: () => setShouldLoop(true) },
        { label: "Cycle through control position options", action: () => {
            const current = position();
            if (current === undefined) setPosition('before');
            else if (current === 'before') setPosition('after');
            else if (current === 'after') setPosition(undefined);
        }},
        { label: "Enable custom control", action: () => setCustomBtn(true) },
    ];

    const reset = () => {
        setDisabled(false);
        setShouldLoop(false);
        setPosition(undefined);
        setCustomBtn(false);
        stepperRef?.setOption('test0')
    };

    const isReactive = createMemo(() => selected() === 'test1');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset)) 

    return (
        <Tab location='stepper'>
            <div class={selectors.assertionElement}>{selected()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <Stepper 
                ref={stepperRef}
                onChange={(value) => setSelected(value)} 
                disabled={disabled()}
                loop={shouldLoop()}
                controls-position={position()}
                class-disabled={selectors.stepperDisabled}
                style={reactiveStyle()} 
                class={`${selectors.stepper} ${reactiveClass()}`}>
                <Stepper.Items style={reactiveStyle()} class={`${selectors.stepperItems} ${reactiveClass()}`}>
                    <For each={stepperOptions}>
                        {(option, index) => (
                            <Stepper.Item 
                                selected={option.selected}
                                value={option.value}
                                class={`${selectors.stepperItem} ${selectors.stepperItem}${index()} ${reactiveClass()}`}
                                style={reactiveStyle()}>
                                {option.value}
                            </Stepper.Item>
                        )}
                    </For>
                </Stepper.Items>
                <Show when={!customBtn()}>
                    <Stepper.Control style={reactiveStyle()} class={`${selectors.stepperControl} ${reactiveClass()}`} />
                </Show>
                <Show when={customBtn()}>
                    <Stepper.Control hidden-class={selectors.controlHidden} class={selectors.stepperControl}>
                        <div class={selectors.stepperCustomControl}></div>
                    </Stepper.Control>
                </Show>
            </Stepper>
        </Tab>
    )
}

export default StepperTest;