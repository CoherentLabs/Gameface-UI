import Checkbox from "@components/Basic/Checkbox/Checkbox";
import { emitChange } from "../../../views/menu/util";

interface CustomToggleProps {
    id: string,
    checked?: boolean,
}

const CustomCheckbox = (props: CustomToggleProps) => {
    return (
        <Checkbox onChange={emitChange} anchor={`#${props.id}`} checked={props.checked ?? false}>
            <Checkbox.Label>On</Checkbox.Label>
        </Checkbox>
    )
}
export default CustomCheckbox