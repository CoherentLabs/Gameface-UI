import { BaseComponentRef, ComponentProps } from "@components/types/ComponentProps";
import { Accessor, Setter, createSignal, ParentComponent, Show, createContext, createMemo, createEffect } from "solid-js";
import styles from './Checkbox.module.scss';
import { Control, CheckboxControl } from "./CheckboxControl";
import { Indicator } from "./CheckboxIndicator";
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";
import { untrack } from "@solidjs/web";

const Label = createTokenComponent<{ before?: boolean }>();

export interface CheckboxRef extends BaseComponentRef {
    checked: Accessor<boolean>,
    value: any,
    setChecked: Setter<boolean>,
}

interface CheckBoxProps extends ComponentProps<CheckboxRef> {
    value?: any
    checked?: boolean
    disabled?: boolean
    'class-disabled'?: string
    'class-checked'?: string
    onChange?: (checked: boolean) => void;
}


export const CheckboxContext = createContext<{ checked: Accessor<boolean> }>();

const Checkbox: ParentComponent<CheckBoxProps> = (props) => {
    const LabelToken = useToken(Label, () => props.children);

    const [checked, setChecked] = createSignal(props.checked ?? false);
    const isBefore = createMemo(() => LabelToken()?.before);
    const checkboxClasses = createMemo(() => {
        const classes = [styles.checkbox];

        if (props.disabled) {
            if (props['class-disabled']) classes.push(`${styles.disabled} ${props['class-disabled']}`);
            else classes.push(styles.disabled);
        }

        if (checked() && props['class-checked']) {
            classes.push(`${props['class-checked']}`);
        }

        return classes.join(' ');
    });


    props.componentClasses = () => checkboxClasses();
    props.refObject = {
        checked,
        value: untrack(() => props.value),
        setChecked,
    }

    const toggle = () => {
        if (props.disabled) return;

        setChecked(prev => !prev);
    }

    createEffect(checked, (value) => {
        props.onChange?.(value);
    }, {defer: true})

    return (
        <CheckboxContext value={{ checked }}>
            <div
                ref={[baseComponent(props), navigationActions(mergeNavigationActions(props, { 'select': toggle }))]}
                onClick={toggle}>

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
        </CheckboxContext>
    )
}

export default Object.assign(Checkbox, { Label, Control, Indicator });