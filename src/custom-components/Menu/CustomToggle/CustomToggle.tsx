import ToggleButton from "@components/Basic/ToggleButton/ToggleButton"

interface CustomToggleProps {
    checked: boolean,
    onChange?: (checked: boolean) => void,
}

const CustomToggle = (props: CustomToggleProps) => {
    return (
        <ToggleButton checked={props.checked} onChange={props.onChange} >
            <ToggleButton.LabelLeft>OFF</ToggleButton.LabelLeft>
            <ToggleButton.LabelRight>ON</ToggleButton.LabelRight>
            <ToggleButton.Control style={{'margin': '0 1vmax'}} />
        </ToggleButton>
    )
}
export default CustomToggle