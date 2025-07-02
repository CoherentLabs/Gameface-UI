import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import ToggleButton, { ToggleButtonRef } from "@components/Basic/ToggleButton/ToggleButton";
import './toggleButton.css';
import selectors from "../../../shared/toggle-button-selectors.json";

const ToggleButtonTest = () => {
    let toggleRef!: ToggleButtonRef;
    const [checked, setChecked] = createSignal(false);
    const [disabled, setDisabled] = createSignal(false);
    const [reactive, setReactive] = createSignal(false);

    const scenarios = [
        { label: "Check programatically", action: () => toggleRef.setChecked(true) },
        { label: "Disable toggle button", action: () => setDisabled(true) },
        { label: "Enable reactive styles", action: () => setReactive(true) },
    ];

    const resetToggle = () => {
        setDisabled(false);
        setChecked(false);
        setReactive(false);
        toggleRef.setChecked(false);
    };

    const isReactive = createMemo(() => reactive() === true);
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', resetToggle))
    onCleanup(() => document.removeEventListener('reset', resetToggle)) 

    return (
        <Tab location='toggle'>
            <div class={selectors.assertionElement}>{checked() ? 'true' : 'false'}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <ToggleButton
                ref={toggleRef}
                disabled={disabled()}
                class-checked={selectors['base-checked']}
                class-disabled={selectors['base-disabled']}
                checked={false}
                onChange={(checked) => setChecked(checked)}
                class={`${selectors.base} ${reactiveClass()}`}
                style={reactiveStyle()}>
                <ToggleButton.LabelLeft>Off</ToggleButton.LabelLeft>
                <ToggleButton.LabelRight>On</ToggleButton.LabelRight>
                <ToggleButton.Control class={`${selectors.control} ${reactiveClass()}`} style={reactiveStyle()}>
                    <ToggleButton.Indicator class={`${selectors.indicator} ${reactiveClass()}`} style={reactiveStyle()} />
                    <ToggleButton.Handle 
                        class={`${selectors.handle} ${reactiveClass()}`} 
                        style={reactiveStyle()}
                        class-checked={selectors["handle-checked"]} 
                        style-checked={{"border": '1px solid white'}} />
                </ToggleButton.Control>
            </ToggleButton>
            
        </Tab>
    )
}

export default ToggleButtonTest;