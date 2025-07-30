import { Accessor, createEffect, createMemo, JSX, ParentComponent, ParentProps, useContext } from "solid-js";
import { RadioContext } from "./Radio";
import { ComponentProps } from "@components/types/ComponentProps";
import styles from './Radio.module.scss';
import { RadioButtonControl } from "./RadioButtonControl";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { Show } from "solid-js";
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";

export interface CommonRadioButtonSlotProps {
    style?: JSX.CSSProperties,
    class?: string,
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
    const LabelToken = useToken(ButtonLabel, props.button.children);
    const radio = useContext(RadioContext);

    if (props.button.selected) radio?.changeOption(props.button.value);

    const isSelected = () => radio?.selected() === props.button.value;

    const buttonClasses = createMemo(() => {
        const classes = [styles['radio-button']];

        if (props.button.disabled) {
            if (props.button['class-disabled']) classes.push(`${styles.disabled} ${props.button['class-disabled']}`);
            else classes.push(styles.disabled);
        }

        if (isSelected() && props.button['class-selected']) classes.push(props.button['class-selected'] ?? '');

        return classes.join(' ');
    });

    props.button.componentClasses = () => buttonClasses();

    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props.button);

    const handleClick = (e?: MouseEvent) => {
        if (props.button.disabled) return;

        radio?.changeOption(props.button.value);
        props.button.click?.(e as MouseEvent);
    }

    return (
        <div
            ref={props.button.ref as HTMLDivElement}
            class={className()}
            style={inlineStyles()}
            use:forwardEvents={props}
            use:forwardAttrs={props}
            onclick={handleClick}>

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
