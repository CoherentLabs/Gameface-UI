import BaseSlider, { SliderRef } from "@components/Basic/Slider/Slider";
import Flex from "@components/Layout/Flex/Flex";
import { Component, createMemo } from "solid-js";
import tableStyles from "../FilterableDataTable.module.scss";
import styles from "./Slider.module.scss";

interface SliderProps {
    label: string;
    min: number;
    max: number;
    value: number;
    onChange?: (value: number) => void;
}

const Slider: Component<SliderProps> = (props) => {
    let sliderRef: SliderRef | undefined;

    return (
        <>
            <Flex direction="row" justify-content="start" gap="0.5rem" align-items="center" >
                <div class={tableStyles['table-nav-filter-panel-row-heading']}>{props.label}</div>
                <div class={styles['slider-value']}>{props.value}</div>
            </Flex>
            <Flex direction='row' align-items="center" gap="0.5rem" class={styles['slider-row']}>
                <span class={styles['slider-bound']}>{props.min}</span>
                <BaseSlider ref={sliderRef} class={styles.slider} min={props.min} max={props.max} value={props.value} step={1} onChange={props.onChange}>
                    <BaseSlider.Track class={styles['slider-track']} />
                    <BaseSlider.Fill class={styles['slider-fill']} />
                    <BaseSlider.Handle class={styles['slider-handle']} />
                </BaseSlider>
                <span class={styles['slider-bound']}>{props.max}</span>
            </Flex>
        </>
    );
};

export default Slider;
