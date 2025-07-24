import { ParentComponent } from "solid-js";
import styles from './Radio.module.scss';
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import { TokenComponentProps } from "@components/types/ComponentProps";
import { CommonRadioButtonSlotProps } from "./RadioButton";

export const ButtonIndicator = createTokenComponent<CommonRadioButtonSlotProps>();

interface RadioButtonIndicatorProps extends TokenComponentProps {
    selected: boolean
}

export const RadioButtonIndicator: ParentComponent<RadioButtonIndicatorProps> = (props) => {
    const IndicatorSlot = useToken(ButtonIndicator, props.parentChildren);

    return (
        <div
            class={`${styles.indicator} ${props.selected ? styles.selected : ''} ${IndicatorSlot?.()?.class || ''}`}
            style={IndicatorSlot?.()?.style || {}}>
            {IndicatorSlot?.()?.children}
        </div>
    )
}
