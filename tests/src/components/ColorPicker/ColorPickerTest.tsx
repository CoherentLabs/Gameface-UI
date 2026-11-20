import { createMemo, createSignal, flush, For, onSettled } from "solid-js";
import selectors from "../../../shared/color-picker-selectors.json";
import ColorPicker, { ColorPickerRef } from "@components/Complex/ColorPicker/ColorPicker";
import { parseHSVAColor } from "@components/Complex/ColorPicker/colorPickerUtils";
import createOnChangeLog from "../onChangeLog";

const initialValue = 'rgba(255, 0, 0, 1)';
const ColorPickerTest = () => {
    let colorPickerRef!: ColorPickerRef;
    const log = createOnChangeLog('color-picker');
    const [value, setValue] = createSignal(initialValue);
    const [test, setTest] = createSignal('red');

    const scenarios = [
        { label: "Change value with ref", action: () => log.sync(() => colorPickerRef.changeColor('rgba(128, 117, 64, 1)')) },
        { label: "Change styles", action: () => { setTest('blue') } },
    ];

    const reset = () => {
        setValue(initialValue);
        setTest('red');
        colorPickerRef?.changeColor(initialValue);
        flush();
        log.clear();
    };

    // Sets the current color again (an event, not a button, so the layout doesn't move).
    const setSameColor = () => log.sync(() => colorPickerRef.changeColor(initialValue));

    const isReactive = createMemo(() => test() === 'blue');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onSettled(() => {
        document.addEventListener('reset', reset);
        document.addEventListener('colorPickerSameColor', setSameColor);
        return () => {
            document.removeEventListener('reset', reset);
            document.removeEventListener('colorPickerSameColor', setSameColor);
        };
    });

    return (
        <>
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
                onChange={(value) => { const rgba = parseHSVAColor(value).rgba; log.record(rgba); setValue(rgba); }}
                value={initialValue}
                style={reactiveStyle()}
                class={`${selectors.colorPicker} ${reactiveClass()}`}>
            </ColorPicker>
        </>
    )
}

export default ColorPickerTest;