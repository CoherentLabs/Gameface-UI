import { JSX, ParentComponent, ParentProps } from "solid-js";
import styles from './RadioButton.module.css';

export interface RadioButtonSlotProps extends ParentProps  {
    style?: JSX.CSSProperties,
    class?: string,
}

interface RadioButtonControlProps {
    controlSlot?: RadioButtonSlotProps,
    indicatorSlot?: RadioButtonSlotProps
    selected: boolean,
    before: boolean | undefined
} 

const RadioButtonControl: ParentComponent<RadioButtonControlProps> = (props) => {
    return (
        <div
            class={`${styles.Control} ${props.before ? styles.Before : ''} ${props.controlSlot?.class || ''}`}
            style={props.controlSlot?.style || {}}>
            {props.controlSlot?.children}
            <div 
                class={`${styles.Indicator} ${props.selected ? styles.Selected : ''} ${props.indicatorSlot?.class || ''}`}
                style={props.indicatorSlot?.style || {}}>
                {props.indicatorSlot?.children}
            </div>
        </div>
    )
}

export default RadioButtonControl