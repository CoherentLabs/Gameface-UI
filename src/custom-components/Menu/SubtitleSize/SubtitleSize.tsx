import Block from "@components/Layout/Block/Block";
import { createSignal } from "solid-js";
import style from './SubtitleSize.module.scss'
import CustomTextSlider from "../CustomTextSlider/CustomTextSlider";
import ExtraContent from "../SidePanel/ExtraContent";

const SubtitleSize = (props: {id: string}) => {
    const [value, setValue] = createSignal('Medium');
    
    return (
        <>
            <CustomTextSlider values={['Small', 'Medium', 'Large', 'Max']} value={value()} onChange={(newValue) => setValue(newValue)}/>
            <ExtraContent id={props.id}>
                <Block class={`${style[`subtitle-${value().toLowerCase()}`]} ${style.subtitle}`}>Your subtitle size</Block>
            </ExtraContent>
        </>
    )
}

export default SubtitleSize;