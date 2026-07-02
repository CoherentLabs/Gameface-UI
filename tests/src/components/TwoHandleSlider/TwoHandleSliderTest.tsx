import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import './two-handle-slider.css';
import selectors from "../../../shared/two-handle-slider-selectors.json";
import TwoHandleSlider, { TwoHandleSliderRef } from "@components/Basic/TwoHandleSlider/TwoHandleSlider";

const initialRange = { start: 20, end: 60 };

const TwoHandleSliderTest = () => {
    let sliderRef!: TwoHandleSliderRef;
    const [controlled, setControlled] = createSignal(initialRange);
    const [start, setStart] = createSignal<number>(initialRange.start);
    const [end, setEnd] = createSignal<number>(initialRange.end);
    const [changeEndStart, setChangeEndStart] = createSignal<number | string>('none');
    const [changeEndEnd, setChangeEndEnd] = createSignal<number | string>('none');
    const [test, setTest] = createSignal('red');

    const scenarios = [
        { label: "Change value with ref", action: () => { sliderRef.changeValue({ start: 30, end: 70 }) } },
        { label: "Change styles", action: () => { setTest('blue') } },
        { label: "Change start with ref", action: () => { sliderRef.changeStart(40) } },
        { label: "Change end with ref", action: () => { sliderRef.changeEnd(80) } },
        { label: "Step start up", action: () => { sliderRef.stepStart(1) } },
        { label: "Step end down", action: () => { sliderRef.stepEnd(-1) } },
        { label: "Set value via prop", action: () => { setControlled({ start: 10, end: 90 }) } },
        { label: "Shift both handles past the previous end with ref", action: () => { sliderRef.changeValue({ start: 70, end: 90 }) } },
    ];

    const reset = () => {
        setControlled(initialRange);
        setStart(initialRange.start);
        setEnd(initialRange.end);
        setChangeEndStart('none');
        setChangeEndEnd('none');
        setTest('red');
        sliderRef?.changeValue(initialRange);
    };

    const isReactive = createMemo(() => test() === 'blue');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset))

    return (
        <Tab location='two-handle-slider'>
            <div class={selectors.assertionStartElement}>{start()}</div>
            <div class={selectors.assertionEndElement}>{end()}</div>
            <div class={selectors.changeEndStartElement}>{changeEndStart()}</div>
            <div class={selectors.changeEndEndElement}>{changeEndEnd()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <TwoHandleSlider
                ref={sliderRef}
                onChange={(value) => { setStart(value.start); setEnd(value.end); }}
                onChangeEnd={(value) => { setChangeEndStart(value.start); setChangeEndEnd(value.end); }}
                min={0}
                max={100}
                step={10}
                value={controlled()}
                style={reactiveStyle()}
                class={`${selectors.slider} ${reactiveClass()}`}>
                <TwoHandleSlider.Fill style={reactiveStyle()} class={`${selectors.sliderFill} ${reactiveClass()}`} />
                <TwoHandleSlider.Track style={reactiveStyle()} class={`${selectors.sliderTrack} ${reactiveClass()}`} />
                <TwoHandleSlider.Handle style={reactiveStyle()} class={`${selectors.sliderHandle} ${reactiveClass()}`} />
                <TwoHandleSlider.Thumb style={reactiveStyle()} class={`${selectors.sliderThumb} ${reactiveClass()}`} />
                <TwoHandleSlider.Grid
                    style={reactiveStyle()}
                    class={`${selectors.sliderGrid} ${reactiveClass()}`}
                    pols-without-text={5} pols={5}
                    pol-style={reactiveStyle()}
                    pol-class={`${selectors.sliderPol} ${reactiveClass()}`} />
            </TwoHandleSlider>
        </Tab>
    )
}

export default TwoHandleSliderTest;
