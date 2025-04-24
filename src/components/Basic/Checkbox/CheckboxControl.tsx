import { Accessor, JSX, ParentComponent, ParentProps } from "solid-js";
import styles from './Checkbox.module.css';

export interface CheckboxSlotProps extends ParentProps  {
    style?: JSX.CSSProperties,
    class?: string,
}

interface CheckboxControlProps {
    controlSlot?: CheckboxSlotProps,
    indicatorSlot?: CheckboxSlotProps
    checked: Accessor<boolean>,
    before: boolean | undefined
} 

const CheckboxControl: ParentComponent<CheckboxControlProps> = (props) => {
    return (
        <div
            class={`${styles.Control} ${props.before ? styles.Before : ''} ${props.controlSlot?.class || ''}`}
            style={props.controlSlot?.style || {}}>
            {props.controlSlot?.children && props.controlSlot.children}
            <div 
                class={`${styles.Indicator} ${props.checked() ? styles.Checked : ''} ${props.indicatorSlot?.class || ''}`}
                style={props.indicatorSlot?.style || {}}>
                {props.indicatorSlot?.children}
            </div>
        </div>
    )
}

export default CheckboxControl