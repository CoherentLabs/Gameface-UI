import Checkbox, { CheckboxRef } from "@components/Basic/Checkbox/Checkbox";
import Tab from "@components/Layout/Tab/Tab";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import Segment, { SegmentRef } from "@components/Basic/Segment/Segment";
import './segment.css';

const SegmentTest = () => {
    let segmentRef!: SegmentRef;
    const [selected, setSelected] = createSignal("");
    const [disabled, setDisabled] = createSignal(false);
    const [disabledBtn, setDisabledBtn] = createSignal(false);

    const resetSegment = () => {
        setDisabled(false);
        setDisabledBtn(false);
        segmentRef.selectOption('test1');
    };

    const changeOption = () => {
        segmentRef.selectOption('test3');
    }

    onMount(() => {
        document.addEventListener('reset', resetSegment)
        document.addEventListener('selectSegmentOption', changeOption)
    })

    onCleanup(() => {
        document.removeEventListener('reset', resetSegment)
        document.removeEventListener('selectSegmentOption', changeOption)
    }) 

    return (
        <Tab location='segment'>
            <div class="assertion-element">{selected()}</div>
            <button onClick={() => setDisabled(true)} class="disable-segment">Disable Segment</button>
            <button onClick={() => setDisabledBtn(true)} class="disable-segment-btn">Disable Segment button</button>

            <Segment 
                onChange={(selected) => setSelected(selected)} 
                disabled={disabled()} 
                class-disabled="segment-disabled" 
                ref={segmentRef}
                class={`test-segment ${selected() !== '' ? 'reactive' : ''}`}
                style={{ "background-color": selected() === 'test3' ? 'green' : '' }} >
                <Segment.Button selected value="test1" class="test-button1">test1</Segment.Button>
                <Segment.Button 
                    disabled={disabledBtn()} 
                    class-disabled="segment-button-disabled" 
                    value="test2" 
                    class={`test-button2 ${selected() !== '' ? 'reactive' : ''}`}
                    style={{ "background-color": selected() === 'test2' ? 'green' : '' }}>test2</Segment.Button>
                <Segment.Button value="test3" class="test-button3">test3</Segment.Button>
                <Segment.Indicator></Segment.Indicator>
            </Segment>

        </Tab>
    )
}

export default SegmentTest;