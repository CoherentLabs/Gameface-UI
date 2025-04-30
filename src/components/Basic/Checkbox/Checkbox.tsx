import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, Setter, createSignal, onMount, ParentComponent, Show, createContext, createMemo, createEffect } from "solid-js";
import styles from './Checkbox.module.css';
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { Control, CheckboxControl } from "./CheckboxControl";
import { Indicator } from "./CheckboxIndicator";
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';

const Label = createTokenComponent<{ before?: boolean }>();

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


export const CheckboxContext = createContext<{ checked: Accessor<boolean> }>();

const Checkbox: ParentComponent<CheckBoxProps> = (props) => {
    const LabelToken = useToken(Label, props.children);

    const [checked, setChecked] = createSignal(props.checked ?? false);
    const isBefore = createMemo(() => LabelToken()?.before);
    let element!: HTMLDivElement;

    props.componentClasses = `${styles.Checkbox} ${props.disabled ? styles.Disabled : ''}`;
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    const toggle = (e?: MouseEvent) => {
        if (props.disabled) return;

        setChecked(prev => !prev);
        props.onChange?.(checked())
    }

    createEffect(() => {
        props.onChange?.(checked());
    })

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
        <CheckboxContext.Provider value={{ checked }}>
            <div
                ref={element!}
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props}
                use:forwardAttrs={props}
                onclick={toggle}>

                <Show when={isBefore()}>
                    {LabelToken()?.children}
                </Show>

                <CheckboxControl parentChildren={props.children} before={isBefore()} />

                <Show when={!LabelToken()}>
                    {props.children}
                </Show>

                <Show when={!isBefore()}>
                    {LabelToken()?.children}
                </Show>

            </div>
        </CheckboxContext.Provider>
    )
}

export default Object.assign(Checkbox, { Label, Control, Indicator });