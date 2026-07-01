import BaseSlider, { TwoHandleSliderRef } from "@components/Basic/TwoHandleSlider/TwoHandleSlider";
import Flex from "@components/Layout/Flex/Flex";
import { Component, createMemo } from "solid-js";
import tableStyles from "../FilterableDataTable.module.scss";
import styles from "../Slider/Slider.module.scss";

interface SliderProps {
    label: string;
    min: number;
    max: number;
    value: { start: number; end: number };
    onChange?: (value: { start: number; end: number }) => void;
}

const TwoHandleSlider: Component<SliderProps> = (props) => {
    let sliderRef: TwoHandleSliderRef | undefined;

    return (
        <>
            <Flex direction="row" justify-content="start" gap="0.5rem" align-items="center" >
                <div class={tableStyles['table-nav-filter-panel-row-heading']}>{props.label}</div>
                <Flex justify-content="start" align-items="center" direction="row" gap="0.25rem">
                    <div class={styles['slider-value']}>{props.value.start}</div>
                    <div>-</div>
                    <div class={styles['slider-value']}>{props.value.end}</div>
                </Flex>
            </Flex>

            <Flex direction='row' align-items="center" gap="0.5rem" class={styles['slider-row']}>
                <span class={styles['slider-bound']}>{props.min}</span>
                <BaseSlider 
                    ref={sliderRef} 
                    class={styles.slider} 
                    min={props.min} 
                    max={props.max} 
                    value={props.value} 
                    step={1} 
                    onChange={props.onChange}>
                    <BaseSlider.Track class={styles['slider-track']} />
                    <BaseSlider.Fill class={styles['slider-fill']} />
                    <BaseSlider.Handle class={styles['slider-handle']} />
                </BaseSlider>
                <span class={styles['slider-bound']}>{props.max}</span>
            </Flex>
        </>
    );
};

export default TwoHandleSlider;
