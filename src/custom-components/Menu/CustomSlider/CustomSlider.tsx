import Slider from "@components/Basic/Slider/Slider"
import Block from "@components/Layout/Block/Block";
import style from './CustomSlider.module.scss';
import { createSignal } from "solid-js";
import Flex from "@components/Layout/Flex/Flex";

interface CustomSliderProps {
    step: number;
    min: number;
    max: number;
    value: number;
    onChange?: (value: number) => void;
}

const CustomSlider = (props: CustomSliderProps) => {
    const [value, setValue] = createSignal(props.value);
    return (
        <Flex align-items="center" class={style.wrapper}>
            <Block class={style['value-preview']}>{value()}</Block>
            <Slider 
                onChange={(newValue) => setValue(newValue)} 
                step={props.step} 
                min={props.min} 
                max={props.max} 
                value={value()} 
                class={style.slider}>
                    <Slider.Handle class={style['slider-handle']}></Slider.Handle>
                    <Slider.Fill class={style['slider-fill']}></Slider.Fill>
                    <Slider.Track class={style['slider-track']}></Slider.Track>
            </Slider>
        </Flex>
    )
}

export default CustomSlider;