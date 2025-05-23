import { ParentComponent } from "solid-js";
import styles from './RadioButton.module.css';
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import { TokenComponentProps } from "@components/types/ComponentProps";
import { CommonRadioButtonSlotProps } from "./RadioButton";
import { RadioButtonIndicator } from "./RadioButtonIndicator";

export const ButtonControl = createTokenComponent<CommonRadioButtonSlotProps>();

interface RadioButtonControlProps extends TokenComponentProps {
    selected: boolean,
    before: boolean | undefined
} 

export const RadioButtonControl: ParentComponent<RadioButtonControlProps> = (props) => {
    const ControlSlot = useToken(ButtonControl, props.parentChildren);

    return (
        <div
            class={`${styles.Control} ${props.before ? styles.Before : ''} ${ControlSlot?.()?.class || ''}`}
            style={ControlSlot?.()?.style || {}}>
            {ControlSlot?.()?.children}
            <RadioButtonIndicator parentChildren={ControlSlot?.()?.children} selected={props.selected} />
        </div>
    )
}
