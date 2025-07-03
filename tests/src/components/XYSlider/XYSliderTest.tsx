import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import XYSlider, { XYSliderRef } from "@components/Basic/XYSlider/XYSlider";
import './xy-slider.css';
import selectors from "../../../shared/xy-slider-selectors.json";

const initialValue = { x: 50, y: 50 };
const XYSliderTest = () => {
    let sliderRef!: XYSliderRef;
    const [value, setValue] = createSignal(initialValue);
    const [test, setTest] = createSignal('red');
    const [minMaxTest, setMinMaxTest] = createSignal({ minX: 0, maxX: 200, minY: 0, maxY: 200 });

    const scenarios = [
        { label: "Change value with ref", action: () => { sliderRef.changeValue({ x: 30, y: 30 }) } },
        { label: "Change styles", action: () => { setTest('blue') } },
        { label: "Change min max reactively", action: () => { setMinMaxTest({ minX: 60, maxX: 100, minY: 60, maxY: 100 }) } },
    ];

    const reset = () => {
        setValue(initialValue);
        setTest('red');
        sliderRef?.changeValue(initialValue);
    };

    const isReactive = createMemo(() => test() === 'blue');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});
    const reactiveStyleBG = createMemo(() => isReactive() ? { 'background-image': 'linear-gradient(to right bottom,rgb(255, 0, 0), #b9b9b9, #777777, #3b3b3b, #000000)' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset))

    return (
        <Tab location='xy-slider'>
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
                onChange={(value) => setValue({ x: parseInt(value.x), y: parseInt(value.y) })}
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
        </Tab>
    )
}

export default XYSliderTest;