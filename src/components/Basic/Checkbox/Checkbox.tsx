import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, Setter, createSignal, ParentComponent, Show, createContext, createMemo, untrack } from "solid-js";
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
    const initialChecked = untrack(() => props.checked ?? false);
    const [checked, setCheckedSignal] = createSignal(initialChecked);
    const isBefore = createMemo(() => LabelToken()?.before);

    // `current` is the always-up-to-date plain copy (Solid 2 stages signal writes).
    // onChange is reported here, at the write: once per change (click, navigation
    // `select` or the ref's setChecked), and before the caller's function returns.
    // 1.x called it twice per click (directly and from an effect).
    let current = initialChecked;
    const writeChecked = (next: boolean) => {
        if (next === current) return;
        current = next;
        setCheckedSignal(next);
        props.onChange?.(next);
    };
    // The ref's setChecked: accepts a value or an updater, like a signal setter.
    function setChecked(next: boolean | ((prev: boolean) => boolean)) {
        writeChecked(typeof next === 'function' ? next(current) : next);
        return current;
    }

    const toggle = () => {
        if (props.disabled) return;

        writeChecked(!current);
    }

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
                        setChecked: setChecked as Setter<boolean>,
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