import ToggleButton from "@components/Basic/ToggleButton/ToggleButton";
import styles from "./Toggle.module.scss";
import { Component } from "solid-js";

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange?: (checked: boolean) => void;
}

const Toggle: Component<ToggleProps> = (props) => {
    return (
        <ToggleButton 
            class={styles.toggle} 
            class-checked={styles['toggle-checked']} 
            checked={props.checked}
            onChange={props.onChange}>
            <ToggleButton.LabelLeft class={styles['toggle-label-left']}>
                {props.label}
            </ToggleButton.LabelLeft>
            <ToggleButton.Control class={styles['toggle-control']}>
                <ToggleButton.Handle class={styles['toggle-handle']} />
                <ToggleButton.Indicator class={styles['toggle-indicator']} />
            </ToggleButton.Control>
        </ToggleButton>
    )
}

export default Toggle;