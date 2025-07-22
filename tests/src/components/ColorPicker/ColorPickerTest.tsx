import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import selectors from "../../../shared/color-picker-selectors.json";
import ColorPicker, { ColorPickerRef } from "@components/Complex/ColorPicker/ColorPicker";
import { parseHSVAColor } from "@components/Complex/ColorPicker/colorPickerUtils";

const initialValue = 'rgba(255, 0, 0, 1)';
const ColorPickerTest = () => {
    let colorPickerRef!: ColorPickerRef;
    const [value, setValue] = createSignal(initialValue);
    const [test, setTest] = createSignal('red');

    const scenarios = [
        { label: "Change value with ref", action: () => { colorPickerRef.changeColor('rgba(128, 117, 64, 1)') } },
        { label: "Change styles", action: () => { setTest('blue') } },
    ];

    const reset = () => {
        setValue(initialValue);
        setTest('red');
        colorPickerRef?.changeColor(initialValue);
    };

    const isReactive = createMemo(() => test() === 'blue');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset))

    return (
        <Tab location='color-picker'>
            <div class={selectors.assertionElement}>{value()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <ColorPicker
                ref={colorPickerRef}
                //@ts-ignore
                onChange={(value) => setValue(parseHSVAColor(value).rgba)}
                value={initialValue}
                style={reactiveStyle()}
                class={`${selectors.colorPicker} ${reactiveClass()}`}>
            </ColorPicker>
        </Tab>
    )
}

export default ColorPickerTest;