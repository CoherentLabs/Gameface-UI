import { createMemo, createSignal, For, onCleanup, onSettled, flush } from "solid-js";
import XYSlider, { XYSliderRef } from "@components/Basic/XYSlider/XYSlider";
import './xy-slider.css';
import selectors from "../../../shared/xy-slider-selectors.json";
import createOnChangeLog from "../onChangeLog";

const initialValue = { x: 50, y: 50 };
const XYSliderTest = () => {
    let sliderRef!: XYSliderRef;
    const log = createOnChangeLog('xy-slider');
    const [value, setValue] = createSignal(initialValue);
    const [test, setTest] = createSignal('red');
    const initialMinMax = { minX: 0, maxX: 200, minY: 0, maxY: 200 };
    const [minMaxTest, setMinMaxTest] = createSignal(initialMinMax);

    const scenarios = [
        { label: "Change value with ref", action: () => log.sync(() => sliderRef.changeValue({ x: 30, y: 30 })) },
        { label: "Change styles", action: () => { setTest('blue') } },
        { label: "Change min max reactively", action: () => { setMinMaxTest({ minX: 60, maxX: 100, minY: 60, maxY: 100 }) } },
    ];

    const reset = () => {
        setValue(initialValue);
        setTest('red');
        // Restore the bounds too: otherwise later tests run with min 60 and their values get clamped.
        setMinMaxTest(initialMinMax);
        // Solid 2 stages writes: apply them before the ref call reads the new props.
        flush();
        sliderRef?.changeValue(initialValue);
        flush();
        log.clear();
    };

    const isReactive = createMemo(() => test() === 'blue');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});
    const reactiveStyleBG = createMemo(() => isReactive() ? { 'background-image': 'linear-gradient(to right bottom,rgb(255, 0, 0), #b9b9b9, #777777, #3b3b3b, #000000)' } : {});

    // Sets the current value again (an event, not a button, so the layout doesn't move).
    const setSameValue = () => log.sync(() => sliderRef.changeValue(initialValue));
    onSettled(() => { document.addEventListener('reset', reset); document.addEventListener('xySliderSameValue', setSameValue); });
    onCleanup(() => { document.removeEventListener('reset', reset); document.removeEventListener('xySliderSameValue', setSameValue); })

    return (
        <>
            <div class={selectors.assertionElement}>{`x: ${value().x} | y: ${value().y}`}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <XYSlider
                ref={sliderRef}
                //@ts-ignore
                onChange={(value) => { log.record(value); setValue({ x: parseInt(value.x), y: parseInt(value.y) }); }}
                minX={minMaxTest().minX}
                maxX={minMaxTest().maxX}
                minY={minMaxTest().minY}
                maxY={minMaxTest().maxY}
                value={initialValue}
                style={reactiveStyle()}
                class={`${selectors.slider} ${reactiveClass()}`}>
                <XYSlider.Handle style={reactiveStyle()} class={`${selectors.sliderHandle} ${reactiveClass()}`} />
                <XYSlider.Background>
                    <div style={reactiveStyleBG()} class={`${selectors.sliderBackground} ${reactiveClass()}`}></div>
                </XYSlider.Background>
            </XYSlider>
        </>
    )
}

export default XYSliderTest;