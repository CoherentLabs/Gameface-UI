import { ParentComponent, useContext } from "solid-js";
import { RadioGroupContext } from "../RadioGroup/RadioGroup";
import { ComponentProps } from "@components/types/ComponentProps";
import styles from './RadioButton.module.css';
import { createSlot, createSlots } from "@components/BaseComponent/Slots";
import RadioButtonControl, { RadioButtonSlotProps } from "./RadioButtonControl";
import { ParentProps } from "solid-js";
import { BaseComponent } from "@components/BaseComponent/BaseComponent";
import { Show } from "solid-js";

interface RadioButtonProps extends ComponentProps {
    value: string,
    disabled?: boolean,
    selected?: boolean,
}

interface LabelProps extends ParentProps  {
    before?: boolean
}

const { useSlots, withSlots } = createSlots({
    Label: createSlot<LabelProps>(),
    Control: createSlot<RadioButtonSlotProps>(),
    Indicator: createSlot<RadioButtonSlotProps>(),
});

const RadioButton: ParentComponent<RadioButtonProps> = (props) => {
    const group = useContext(RadioGroupContext)

    if (!group) throw new Error('RadioButton must be used within a <RadioGroup> component');
    
    if (props.selected) group.changeOption(props.value);

    const slots = useSlots();
    const isBefore = slots.Label?.before; 
    const isSelected = () => group.selected() === props.value;
    props.componentClasses = `${styles.RadioButton} ${props.disabled ? styles.Disabled : ''}`
    
    const handleClick = (e?: MouseEvent) => {
        if (props.disabled) return;

        group.changeOption(props.value);
        props.click?.(e as MouseEvent);
    }
    
    return (
        <div 
            ref={props.ref as HTMLDivElement}
            {...BaseComponent(props).attributes}
            {...BaseComponent(props).eventHandlers} 
            class={BaseComponent(props).className}
            style={BaseComponent(props).style}
            onclick={handleClick}>
            
            <Show when={isBefore}>
                {slots.Label?.children}
            </Show>

            <RadioButtonControl controlSlot={slots.Control} indicatorSlot={slots.Indicator} selected={isSelected()} before={isBefore} />

            <Show when={!slots.Label}>
                {props.children}
            </Show>

            <Show when={!isBefore}>
                {slots.Label?.children}
            </Show>
        </div>
    )
}

export default withSlots(RadioButton);