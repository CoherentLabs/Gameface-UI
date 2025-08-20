import { createSignal } from "solid-js";
import TextSlider from "@components/Basic/TextSlider/TextSlider";
import style from './CustomTextSlider.module.scss';

interface CustomSliderProps {
    value: string;
    values: string[];
    onChange?: (value: string) => void;
}

const CustomTextSlider = (props: CustomSliderProps) => {
    return (
        <TextSlider 
            onChange={props.onChange}
            class={style.slider}
            values={props.values} 
            value={props.value}>
                <TextSlider.Handle class={style['slider-handle']}></TextSlider.Handle>
                <TextSlider.Fill class={style['slider-fill']}></TextSlider.Fill>
                <TextSlider.Track class={style['slider-track']}></TextSlider.Track>
                <TextSlider.Pol class={style['slider-pol']}></TextSlider.Pol>
        </TextSlider>
    )
}

export default CustomTextSlider;