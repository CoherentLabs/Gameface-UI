import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, Setter, createSignal, ParentComponent, Show, createContext, createMemo, createEffect, untrack } from "solid-js";
import styles from './Checkbox.module.scss';
import { Control, CheckboxControl } from "./CheckboxControl";
import { Indicator } from "./CheckboxIndicator";
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";
import exposeRef from "@components/utils/exposeRef";

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
    'class-disabled'?: string
    'class-checked'?: string
    onChange?: (checked: boolean) => void;
}


// `null` default: the indicator reads it optionally (pattern 1.3.o).
export const CheckboxContext = createContext<{ checked: Accessor<boolean> } | null>(null);

const Checkbox: ParentComponent<CheckBoxProps> = (props) => {
    const LabelToken = useToken(Label, () => props.children);

    // Initial value only, as in 1.x.
    const [checked, setChecked] = createSignal(untrack(() => props.checked ?? false));
    const isBefore = createMemo(() => LabelToken()?.before);

    const toggle = () => {
        if (props.disabled) return;

        setChecked(prev => !prev);
    }

    // onChange fires once per change (click, navigation `select` or the ref's
    // setChecked). The 1.x toggle also called it directly, right after
    // setChecked; in Solid 2 that read would return the old value.
    createEffect(
        () => checked(),
        // Block body: whatever an effect's apply function returns is treated
        // as its cleanup, so a user onChange returning a value would halt Solid.
        (v) => { props.onChange?.(v); },
        { defer: true }
    );

    return (
        <CheckboxContext value={{ checked }}>
            <div
                class={[
                    styles.checkbox,
                    props.disabled && styles.disabled,
                    props.disabled && props['class-disabled'],
                    checked() && props['class-checked'],
                    props.class,
                ]}
                style={props.style}
                ref={[
                    exposeRef<Omit<CheckboxRef, 'element'>>(props, {
                        checked,
                        setChecked,
                        get value() { return props.value; },
                    }),
                    baseComponent(props),
                    navigationActions(mergeNavigationActions(props, { 'select': toggle })),
                ]}
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