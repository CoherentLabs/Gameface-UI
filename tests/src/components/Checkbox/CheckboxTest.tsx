import Checkbox, { CheckboxRef } from "@components/Basic/Checkbox/Checkbox";
import Tab from "@components/Layout/Tab/Tab";
import { createSignal, For, onCleanup, onMount } from "solid-js";
import selectors from '../../../shared/checkbox-selectors.json';
import './checkbox.css';

const CheckboxTest = () => {
    const [checked, setChecked] = createSignal(false);
    const [disabled, setDisabled] = createSignal(false);
    let checkboxRef!: CheckboxRef;

    const scenarios = [
        { label: "Disable Checkbox", action: () => setDisabled(true) }
    ];

    const resetCheckbox = () => {
        checkboxRef?.setChecked(false);
        setDisabled(false);
    };

    onMount(() => {
        document.addEventListener('reset', resetCheckbox)
    })

    onCleanup(() => {
        document.removeEventListener('reset', resetCheckbox)
    }) 

    return (
        <Tab location='checkbox'>
            <div style={{visibility: `${checked() === false ? 'hidden' : 'visible'}`}} class={selectors.assertionElement}>{checked() ? 'true' : 'false'}</div>
            <For each={scenarios}>
                {(sc, i) => (
                    <button onClick={sc.action} class={`${selectors.scenarioBtn} scenario-${i()}`}>{sc.label}</button>
                )}
            </For>
            <Checkbox 
                disabled={disabled()}
                checked={false}
                onChange={(checked) => setChecked(checked)}
                mouseenter={() => setChecked(true)}                
                ref={checkboxRef} 
                class={`${selectors.base} ${checked() ? 'reactive' : ''}`}
                style={{ "background-color": checked() ? 'red' : '' }}
                class-disabled={'disabled'}
                class-checked={'checked'}>
                <Checkbox.Label>Test Checkbox</Checkbox.Label>
                <Checkbox.Control>
                    <Checkbox.Indicator class={`${selectors.indicator}`} />
                </Checkbox.Control>
            </Checkbox>
        </Tab>
    )
}

export default CheckboxTest;