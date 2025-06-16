import Checkbox, { CheckboxRef } from "@components/Basic/Checkbox/Checkbox";
import Tab from "@components/Layout/Tab/Tab";
import './checkbox.css';
import { createSignal, onCleanup, onMount } from "solid-js";

const CheckboxTest = () => {
    const [checked, setChecked] = createSignal(false);
    const [disabled, setDisabled] = createSignal(false);
    let checkboxRef!: CheckboxRef;

    const resetCheckbox = () => {
        checkboxRef.setChecked(false);
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
            <div style={{visibility: `${checked() === false ? 'hidden' : 'visible'}`}} class="assertion-element">{checked() ? 'true' : 'false'}</div>
            <button onClick={() => setDisabled(true)} class="disable-btn">Disable Checkbox</button>

            <Checkbox 
                disabled={disabled()}
                checked={false}
                onChange={(checked) => setChecked(checked)}
                mouseenter={() => setChecked(true)}                
                ref={checkboxRef} 
                class={`test-checkbox ${checked() ? 'reactive' : ''}`}
                style={{ "background-color": checked() ? 'red' : '' }}
                class-disabled={'disabled'}
                class-checked={'checked'}>
                <Checkbox.Label>Test Checkbox</Checkbox.Label>
                <Checkbox.Control>
                    <Checkbox.Indicator class='test-checkbox-indicator' />
                </Checkbox.Control>
            </Checkbox>

        </Tab>
    )
}

export default CheckboxTest;