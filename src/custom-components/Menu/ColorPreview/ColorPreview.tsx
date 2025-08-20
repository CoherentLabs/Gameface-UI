import { ColorPickerRef } from "@components/Complex/ColorPicker/ColorPicker"
import Block from "@components/Layout/Block/Block"
import { createSignal, Show, useContext } from "solid-js"
import { parseHSVAColor } from "@components/Complex/ColorPicker/colorPickerUtils";
import { Portal } from "solid-js/web";
import { MenuContext } from "../../../views/menu/Menu";
import MenuColorPicker from "./MenuColorPicker";
import styles from './ColorPreview.module.scss';

const ColorPreview = (props: {id: string}) => {
    const [color, setColor] = createSignal('#868599');
    let colorPickerRef: ColorPickerRef;
    const menuContext = useContext(MenuContext);
    
    return (
        <Block class={styles.wrapper}>
            <Block style={{"background-color": color()}} class={styles['color-block']} />
                <Show when={menuContext?.currentOption() === props.id}>
                    <Portal mount={document.querySelector('.extra-content')!}>
                        <MenuColorPicker 
                            onChange={(value) => setColor(parseHSVAColor(value).rgba)} 
                            value={color()} 
                            class={styles['color-picker']} ref={colorPickerRef!} />
                    </Portal>
                </Show>
        </Block>
    )
}

export default ColorPreview;