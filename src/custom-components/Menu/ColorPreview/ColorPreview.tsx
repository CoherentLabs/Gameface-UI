import { ColorPickerRef } from "@components/Complex/ColorPicker/ColorPicker"
import Block from "@components/Layout/Block/Block"
import { createSignal } from "solid-js"
import { parseHSVAColor } from "@components/Complex/ColorPicker/colorPickerUtils";
import MenuColorPicker, { ColorData } from "./MenuColorPicker";
import ExtraContent from "../SidePanel/ExtraContent";
import { emitChange } from "../../../views/menu/util";
import styles from './ColorPreview.module.scss';

const ColorPreview = (props: {id: string}) => {
    const [color, setColor] = createSignal('#868599');
    let colorPickerRef: ColorPickerRef;

    const handleChange = (value: ColorData) => {
        setColor(parseHSVAColor(value).rgba)
        emitChange();
    }
    
    return (
        <Block class={styles.wrapper}>
            <Block style={{"background-color": color()}} class={styles['color-block']} />
            <ExtraContent id={props.id}>
                <MenuColorPicker 
                        size="L"
                        onChange={handleChange} 
                        value={color()} 
                        class={styles['color-picker']} ref={colorPickerRef!} />
            </ExtraContent>
        </Block>
    )
}

export default ColorPreview;