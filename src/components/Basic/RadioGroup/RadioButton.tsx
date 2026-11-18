import { onSettled, ParentComponent, ParentProps, untrack, useContext } from "solid-js";
import { JSX } from "@solidjs/web";
import { RadioContext } from "./Radio";
import { ComponentProps } from "@components/types/ComponentProps";
import styles from './Radio.module.scss';
import { RadioButtonControl } from "./RadioButtonControl";
import { Show } from "solid-js";
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import baseComponent from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";

export interface CommonRadioButtonSlotProps {
    style?: JSX.CSSProperties,
    class?: JSX.ClassValue,
}

interface RadioButtonProps extends ParentProps, ComponentProps, CommonRadioButtonSlotProps {
    value: string,
    disabled?: boolean,
    selected?: boolean,
    'class-disabled'?: string,
    'class-selected'?: string
}

interface LabelProps {
    before?: boolean
}

export const ButtonLabel = createTokenComponent<LabelProps>();
export const Button = createTokenComponent<RadioButtonProps>();

export const RadioButton: ParentComponent<{ button: RadioButtonProps }> = (props) => {
    const LabelToken = useToken(ButtonLabel, () => props.button.children);
    const radio = useContext(RadioContext);

    // Initial selection, read once (Radio's signal allows this write during setup).
    untrack(() => {
        if (props.button.selected) radio?.changeOption(props.button.value);
    });

    const isSelected = () => radio?.selected() === props.button.value;

    const handleClick = (e?: MouseEvent) => {
        if (props.button.disabled) return;

        radio?.changeOption(props.button.value);
        props.button.click?.(e as MouseEvent);
    }

    onSettled(() => {
        untrack(() => radio?.radioOptions.push(props.button.value));
    })

    return (
        <div
            class={[
                styles['radio-button'],
                props.button.disabled && styles.disabled,
                props.button.disabled && props.button['class-disabled'],
                isSelected() && props.button['class-selected'],
                props.button.class,
            ]}
            style={props.button.style}
            ref={[exposeRef(props.button), baseComponent(props.button)]}
            onClick={handleClick}>

            <Show when={LabelToken?.()?.before}>
                {LabelToken?.()?.children}
            </Show>

            <RadioButtonControl parentChildren={props.button.children} selected={isSelected()} before={LabelToken?.()?.before} />

            <Show when={!LabelToken?.()}>
                {props.button.children}
            </Show>

            <Show when={!LabelToken?.()?.before}>
                {LabelToken?.()?.children}
            </Show>
        </div>
    )
}
