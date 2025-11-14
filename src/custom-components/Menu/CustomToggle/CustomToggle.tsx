import ToggleButton from "@components/Basic/ToggleButton/ToggleButton"
import { emitChange } from "../../../views/menu/util";

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
        <ToggleButton attr:id={props.id} checked={props.checked} onChange={handleChange} >
            <ToggleButton.LabelLeft>OFF</ToggleButton.LabelLeft>
            <ToggleButton.LabelRight>ON</ToggleButton.LabelRight>
            <ToggleButton.Control style={{'margin': '0 1vmax'}} />
        </ToggleButton>
    )
}
export default CustomToggle