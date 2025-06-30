import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount} from "solid-js";
import Slider, { SliderRef } from "@components/Basic/Slider/Slider";
import './slider.css';
import selectors from "../../../shared/slider-selectors.json";

const initialValue = 10;
const SliderTest = () => {
    let sliderRef!: SliderRef;
    const [value, setValue] = createSignal(initialValue);
    const [test, setTest] = createSignal('red');

    const scenarios = [
        { label: "Change value with ref", action: () => {sliderRef.changeValue(20)}},
        { label: "Change styles", action: () => {setTest('blue')}},
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
        <Tab location='slider'>
            <div class={selectors.assertionElement}>{value()}</div>
            
            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <Slider
                ref={sliderRef}
                onChange={(value) => setValue(value)}
                min={0}
                max={100}
                step={10}
                value={initialValue}
                style={reactiveStyle()} 
                class={`${selectors.slider} ${reactiveClass()}`}>
                <Slider.Fill style={reactiveStyle()} class={`${selectors.sliderFill} ${reactiveClass()}`} />
                <Slider.Track style={reactiveStyle()} class={`${selectors.sliderTrack} ${reactiveClass()}`} />
                <Slider.Handle style={reactiveStyle()} class={`${selectors.sliderHandle} ${reactiveClass()}`} />
                <Slider.Thumb style={reactiveStyle()} class={`${selectors.sliderThumb} ${reactiveClass()}`} />
                <Slider.Grid 
                    style={reactiveStyle()} 
                    class={`${selectors.sliderGrid} ${reactiveClass()}`} 
                    pols-without-text={5} pols={5} 
                    pol-style={reactiveStyle()} 
                    pol-class={`${selectors.sliderPol} ${reactiveClass()}`} />
            </Slider>
        </Tab> 
    )
}

export default SliderTest;