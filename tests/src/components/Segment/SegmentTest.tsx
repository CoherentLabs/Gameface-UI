import Tab from "@components/Layout/Tab/Tab";
import { createSignal, onCleanup, onMount } from "solid-js";
import Segment, { SegmentRef } from "@components/Basic/Segment/Segment";
import './segment.css';
import selectors from "../../../shared/segment-selectors.json";

const SegmentTest = () => {
    let segmentRef!: SegmentRef;
    const [selected, setSelected] = createSignal("");
    const [disabled, setDisabled] = createSignal(false);
    const [disabledBtn, setDisabledBtn] = createSignal(false);

    const resetSegment = () => {
        setDisabled(false);
        setDisabledBtn(false);
        segmentRef?.selectOption('test1');
    };

    const changeOption = () => {
        segmentRef?.selectOption('test3');
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
            <div class={selectors.assertionElement}>{selected()}</div>
            <button onClick={() => setDisabled(true)} class={selectors.disableSegment}>Disable Segment</button>
            <button onClick={() => setDisabledBtn(true)} class={selectors.disableSegmentBtn}>Disable Segment button</button>

            <Segment 
                onChange={(selected) => setSelected(selected)} 
                disabled={disabled()} 
                class-disabled={selectors.segmentDisabled} 
                ref={segmentRef}
                class={`${selectors.segment} ${selected() !== '' ? selectors.reactive : ''}`}
                style={{ "background-color": selected() === 'test3' ? 'green' : '' }} >
                <Segment.Button selected value="test1" class={selectors.segmentButton1}>test1</Segment.Button>
                <Segment.Button 
                    disabled={disabledBtn()} 
                    class-disabled={selectors.segmentButtonDisabled} 
                    value="test2" 
                    class={`${selectors.segmentButton2} ${selected() !== '' ? selectors.reactive : ''}`}
                    style={{ "background-color": selected() === 'test2' ? 'green' : '' }}>test2</Segment.Button>
                <Segment.Button value="test3" class={selectors.segmentButton3}>test3</Segment.Button>
                <Segment.Indicator></Segment.Indicator>
            </Segment>

        </Tab>
    )
}

export default SegmentTest;