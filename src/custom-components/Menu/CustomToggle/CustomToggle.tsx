import ToggleButton from "@components/Basic/ToggleButton/ToggleButton"
import { emitChange } from "../../../views/menu/util";

interface CustomToggleProps {
    checked: boolean,
    onChange?: (checked: boolean) => void,
    anchor?: string,
}

const CustomToggle = (props: CustomToggleProps) => {
    const handleChange = (checked: boolean) => {
        props.onChange?.(checked);
        emitChange();
    }
    return (
        <ToggleButton anchor={props.anchor} checked={props.checked} onChange={handleChange} >
            <ToggleButton.LabelLeft>OFF</ToggleButton.LabelLeft>
            <ToggleButton.LabelRight>ON</ToggleButton.LabelRight>
            <ToggleButton.Control style={{'margin': '0 1vmax'}} />
        </ToggleButton>
    )
}
export default CustomToggle