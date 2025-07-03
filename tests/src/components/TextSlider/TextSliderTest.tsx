import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import './text-slider.css';
import selectors from "../../../shared/slider-selectors.json";
import TextSlider, { TextSliderRef } from "@components/Basic/TextSlider/TextSlider";

const initialValue = 'Easy';
const TextSliderTest = () => {
    let sliderRef!: TextSliderRef;
    const [value, setValue] = createSignal(initialValue);
    const [test, setTest] = createSignal('red');

    const scenarios = [
        { label: "Change value with ref", action: () => { sliderRef.changeValue('Medium') } },
        { label: "Change styles", action: () => { setTest('blue') } },
    ];

    const reset = () => {
        setValue(initialValue);
        setTest('red');
        sliderRef?.changeValue(initialValue);
    };

    const isReactive = createMemo(() => test() === 'blue');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset))

    return (
        <Tab location='text-slider'>
            <div class={selectors.assertionElement}>{value()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <TextSlider
                ref={sliderRef}
                onChange={(value) => setValue(value)}
                values={['Easy', 'Medium', 'Hard', 'Extreme']}
                value={initialValue}
                style={reactiveStyle()}
                class={`${selectors.slider} ${reactiveClass()}`}>
                <TextSlider.Fill style={reactiveStyle()} class={`${selectors.sliderFill} ${reactiveClass()}`} />
                <TextSlider.Track style={reactiveStyle()} class={`${selectors.sliderTrack} ${reactiveClass()}`} />
                <TextSlider.Handle style={reactiveStyle()} class={`${selectors.sliderHandle} ${reactiveClass()}`} />
                <TextSlider.Thumb style={reactiveStyle()} class={`${selectors.sliderThumb} ${reactiveClass()}`} />
                <TextSlider.Pol
                    style={reactiveStyle()}
                    class={`${selectors.sliderPol} ${reactiveClass()}`}
                    text-style={reactiveStyle()}
                    text-class={`${selectors.sliderPolText} ${reactiveClass()}`} />
            </TextSlider>
        </Tab>
    )
}

export default TextSliderTest;