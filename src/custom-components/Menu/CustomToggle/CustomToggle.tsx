import ToggleButton from "@components/Basic/ToggleButton/ToggleButton"
import { emitChange } from "../../../views/menu/util";
import { Accessor, createMemo } from "solid-js";

interface CustomToggleProps {
    id?: string,
    checked: boolean,
    onChange?: (checked: boolean) => void,
}

const CustomToggle = (props: CustomToggleProps) => {
    const handleChange = (checked: boolean) => {
        props.onChange?.(checked);
        emitChange();
    }

    return (
        <ToggleButton checked={props.checked} onChange={handleChange} anchor={`#${props.id}`}>
            <ToggleButton.LabelLeft>OFF</ToggleButton.LabelLeft>
            <ToggleButton.LabelRight>ON</ToggleButton.LabelRight>
            <ToggleButton.Control style={{'margin': '0 1vmax'}} />
        </ToggleButton>
    )
}
export default CustomToggle