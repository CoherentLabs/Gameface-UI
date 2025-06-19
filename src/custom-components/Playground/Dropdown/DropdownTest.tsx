import Tab from "@components/Layout/Tab/Tab";
import { createEffect, createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import Dropdown, { DropdownRef } from "@components/Basic/Dropdown/Dropdown";
import './dropdown.css';

const dropdownOptions = [
    { value: 'test', },
    { value: 'test', },
    { value: 'test', },
]

const DropdownTest = () => {
    let dropdownRef!: DropdownRef;
    const [selected, setSelected] = createSignal("");
    const [disabled, setDisabled] = createSignal(false);
    const [btnDisabled, setBtnDisabled] = createSignal(false);
    const [options, setOptions] = createSignal(dropdownOptions);
    const [customIcon, setCustomIcon] = createSignal(false);

    const scenarios = [
        { label: "Select option with ref", action: () => dropdownRef?.selectOption("test1") },
        { label: "Disable dropdown", action: () => setDisabled(true) },
        { label: "Disable option", action: () => setBtnDisabled(true) },
        { label: "Enable Overflow", action: () => setOptions([...dropdownOptions, ...dropdownOptions]) },
        { label: "Enable custom icon", action: () => setCustomIcon(true) },
    ];

    const reset = () => {
        setSelected('');
        setDisabled(false);
        setCustomIcon(false);
        setBtnDisabled(false);
        setOptions(dropdownOptions);
        dropdownRef?.selectOption('');
    };

    const isReactive = createMemo(() => selected() === 'test1');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset)) 

    return (
        <Tab location='dropdown'>
            <div class="assertion-element">{selected()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`scenario-btn scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <Dropdown 
                ref={dropdownRef}
                onChange={(value) => setSelected(value)} 
                disabled={disabled()}
                class-disabled={'dropdown-disabled'}
                style={reactiveStyle()} 
                class={`dropdown ${reactiveClass()}`}>
                <Dropdown.Options style={reactiveStyle()} class={`dropdown-options ${reactiveClass()}`}>
                        <For each={options()}>
                        {(option, index) => (
                            <Dropdown.Option
                                value={option.value + index()}
                                disabled={btnDisabled()}
                                class-disabled="option-disabled"
                                class-selected="option-selected"
                                class={`dropdown-option dropdown-option${index()} ${reactiveClass()}`}
                                style={reactiveStyle()}>
                                {option.value + index()}
                            </Dropdown.Option>
                        )}
                    </For>
                </Dropdown.Options>

                <Dropdown.Trigger style={reactiveStyle()} class={`dropdown-trigger ${reactiveClass()}`} />
                <Dropdown.Placeholder class="dropdown-placeholder">Select any option</Dropdown.Placeholder>
                <Dropdown.Icon style={reactiveStyle()} class={`dropdown-icon ${reactiveClass()}`}>
                    <Show when={customIcon()}>
                        Custom Icon
                    </Show>
                </Dropdown.Icon>
                <Dropdown.Track style={reactiveStyle()} class={`dropdown-track ${reactiveClass()}`} />
                <Dropdown.Handle style={reactiveStyle()} class={`dropdown-handle ${reactiveClass()}`}/>
            </Dropdown>
        </Tab> 
    )
}

export default DropdownTest;