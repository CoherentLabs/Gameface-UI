import { createMemo, createSignal, For, onCleanup, onSettled, flush } from "solid-js";
import ToggleButton, { ToggleButtonRef } from "@components/Basic/ToggleButton/ToggleButton";
import './toggleButton.css';
import selectors from "../../../shared/toggle-button-selectors.json";
import createOnChangeLog from "../onChangeLog";

const ToggleButtonTest = () => {
    let toggleRef!: ToggleButtonRef;
    const [checked, setChecked] = createSignal(false);
    const [disabled, setDisabled] = createSignal(false);
    const [reactive, setReactive] = createSignal(false);
    const [controlled, setControlled] = createSignal(false);
    const log = createOnChangeLog('toggle-button');
    const controlledLog = createOnChangeLog('toggle-button-controlled');

    const scenarios = [
        { label: "Check programatically", action: () => log.sync(() => toggleRef?.setChecked(true)) },
        { label: "Disable toggle button", action: () => setDisabled(true) },
        { label: "Enable reactive styles", action: () => setReactive(true) },
        { label: "Set the same value via ref", action: () => log.sync(() => toggleRef?.setChecked(false)) },
        { label: "Toggle via ref updater", action: () => log.sync(() => toggleRef?.setChecked((prev) => !prev)) },
    ];

    const resetToggle = () => {
        setDisabled(false);
        setChecked(false);
        setReactive(false);
        setControlled(false);
        // Solid 2 stages writes: apply them before the ref call reads the new props.
        flush();
        toggleRef?.setChecked(false);
        flush();
        log.clear();
        controlledLog.clear();
    };

    const isReactive = createMemo(() => reactive() === true);
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onSettled(() => { document.addEventListener('reset', resetToggle); });
    onCleanup(() => document.removeEventListener('reset', resetToggle)) 

    return (
        <>
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
                onChange={(checked) => { log.record(checked); setChecked(checked); }}
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

            {/* Controlled: `checked` follows onChange. A click must report once (the echo through the prop is skipped). */}
            <ToggleButton
                class={selectors.controlled}
                checked={controlled()}
                onChange={(checked) => { controlledLog.record(checked); setControlled(checked); }}>
                <ToggleButton.Control />
            </ToggleButton>
        </>
    )
}

export default ToggleButtonTest;