import { ColorPickerRef } from "@components/Complex/ColorPicker/ColorPicker"
import Block from "@components/Layout/Block/Block"
import { createSignal } from "solid-js"
import { parseHSVAColor } from "@components/Complex/ColorPicker/colorPickerUtils";
import MenuColorPicker, { ColorData } from "./MenuColorPicker";
import ExtraContent from "../SidePanel/ExtraContent";
import { emitChange } from "../../../views/menu/util";
import styles from './ColorPreview.module.scss';
import { useNavigation } from "@components/Utility/Navigation/Navigation";

const NAV_AREA_NAME = "menu-color-picker";

const ColorPreview = (props: {id: string}) => {
    const [color, setColor] = createSignal('#868599');
    let colorPickerRef: ColorPickerRef;
    const nav = useNavigation();

    const handleChange = (value: ColorData) => {
        setColor(parseHSVAColor(value).rgba)
        emitChange();
    }
    
    return (
        <Block class={styles.wrapper} anchor={`#${props.id}`} onAction={{
            'select': () => nav?.focusFirst(NAV_AREA_NAME)
        }}>
            <Block style={{"background-color": color()}} class={styles['color-block']} />
            <ExtraContent id={props.id}>
                <MenuColorPicker 
                        areaName={NAV_AREA_NAME}
                        attr:id={`${props.id}-1`}
                        size="L"
                        onChange={handleChange} 
                        value={color()} 
                        class={styles['color-picker']} ref={colorPickerRef!} />
            </ExtraContent>
        </Block>
    )
}

export default ColorPreview;