import { createSlot, createSlots } from "@components/BaseComponent/Slots";
import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, Setter, createSignal, onMount, ParentComponent, ParentProps, Show } from "solid-js";
import styles from './Checkbox.module.css';
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import CheckboxControl, { CheckboxSlotProps } from "./CheckboxControl";

export interface CheckboxRef {
    checked: Accessor<boolean>,
    value: any,
    setChecked: Setter<boolean>,
    element: HTMLDivElement,
}

interface CheckBoxProps extends ComponentProps {
    value?: any
    checked?: boolean
    disabled?: boolean
    onChange?: (checked: boolean) => void;
}

interface LabelProps extends ParentProps  {
    before?: boolean
}

const { useSlots, withSlots } = createSlots({
    Label: createSlot<LabelProps>(),
    Control: createSlot<CheckboxSlotProps>(),
    Indicator: createSlot<CheckboxSlotProps>(),
});

const Checkbox: ParentComponent<CheckBoxProps> = (props) => {
    const slots = useSlots();
    const [checked, setChecked] = createSignal(props.checked ?? false);
    const isBefore = slots.Label?.before;
    let element!: HTMLDivElement;

    props.componentClasses = `${styles.Checkbox} ${props.disabled ? styles.Disabled : ''}`;
    const {className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);
 
    const toggle = (e?: MouseEvent) => {
        if (props.disabled) return;

        setChecked(prev => !prev);
        props.click?.(e as MouseEvent);
        props.onChange?.(checked())
    }

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            checked,
            value: props.value,
            setChecked,
            element,
        });
    });

    return (
        <div
            ref={element!}
            class={className()}
            style={inlineStyles()}
            use:forwardEvents={props}
            use:forwardAttrs={props}
            onclick={toggle}>

            <Show when={isBefore}>
                {slots.Label?.children}
            </Show>

            <CheckboxControl controlSlot={slots.Control} indicatorSlot={slots.Indicator} before={isBefore} checked={checked} />

            <Show when={!slots.Label}>
                {props.children}
            </Show>

            <Show when={!isBefore}>
                {slots.Label?.children}
            </Show>

        </div>
    )
}

export default withSlots(Checkbox)