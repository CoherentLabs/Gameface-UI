import TextSlider from "@components/Basic/TextSlider/TextSlider";
import Block from "@components/Layout/Block/Block";
import { createSignal, Show, useContext } from "solid-js";
import { Portal } from "solid-js/web";
import { MenuContext } from "../../../views/menu/Menu";
import style from './SubtitleSize.module.scss'
import CustomTextSlider from "../CustomTextSlider/CustomTextSlider";

const SubtitleSize = (props: {id: string}) => {
    const [value, setValue] = createSignal('Medium');
    const menuContext = useContext(MenuContext);
    
    return (
        <>
            <CustomTextSlider values={['Small', 'Medium', 'Large', 'Max']} value={value()} onChange={(newValue) => setValue(newValue)}/>
            <Show when={menuContext?.currentOption() === props.id}>
                <Portal mount={document.querySelector('.extra-content')!}>
                    <Block class={`${style[`subtitle-${value().toLowerCase()}`]} ${style.subtitle}`}>Your subtitle size</Block>
                </Portal>
            </Show>
        </>
    )
}

export default SubtitleSize;