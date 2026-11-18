import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, Setter, createSignal, ParentComponent, Show, createContext, createEffect, untrack } from "solid-js";
import styles from './ToggleButton.module.scss';
import { Control, ToggleButtonControl } from "./ToggleButtonControl";
import { Indicator } from "./ToggleButtonIndicator";
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { Handle } from "./ToggleButtonHandle";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";
import exposeRef from "@components/utils/exposeRef";

export const LabelLeft = createTokenComponent();
export const LabelRight = createTokenComponent();

export interface ToggleButtonRef {
    checked: Accessor<boolean>,
    setChecked: Setter<boolean>,
    element: HTMLDivElement,
}

interface ToggleButtonProps extends ComponentProps {
    checked?: boolean
    disabled?: boolean
    'class-disabled'?: string
    'class-checked'?: string
    onChange?: (checked: boolean) => void;
}


// `null` default: the parts read it optionally (pattern 1.3.o).
export const ToggleButtonContext = createContext<{ checked: Accessor<boolean> } | null>(null);

const ToggleButton: ParentComponent<ToggleButtonProps> = (props) => {
    const LabelLeftToken = useToken(LabelLeft, () => props.children);
    const LabelRightToken = useToken(LabelRight, () => props.children);

    const [checked, setChecked] = createSignal(untrack(() => props.checked ?? false));

    // Controlled mode: follow the `checked` prop when it is set.
    createEffect(
        () => props.checked,
        (value) => { if (value !== undefined) setChecked(value); }
    );

    const toggle = () => {
        if (props.disabled) return;

        setChecked(prev => !prev);
    }

    createEffect(
        () => checked(),
        // Block body: the apply function's return value is its cleanup.
        (v) => { props.onChange?.(v); },
        { defer: true }
    );

    return (
        <ToggleButtonContext value={{ checked }}>
            <div
                class={[
                    styles['toggle-button'],
                    props.disabled && styles.disabled,
                    props.disabled && props['class-disabled'],
                    checked() && props['class-checked'],
                    props.class,
                ]}
                style={props.style}
                ref={[
                    exposeRef<Omit<ToggleButtonRef, 'element'>>(props, { checked, setChecked }),
                    baseComponent(props),
                    navigationActions(mergeNavigationActions(props, {'select': toggle})),
                ]}
                onClick={toggle}>

                <Show when={LabelLeftToken()}>
                    {LabelLeftToken()?.children}
                </Show>

                <ToggleButtonControl parentChildren={props.children} />

                <Show when={LabelRightToken()}>
                    {LabelRightToken()?.children}
                </Show>
            </div>
        </ToggleButtonContext>
    )
}

export default Object.assign(ToggleButton, { LabelLeft, LabelRight, Control, Indicator, Handle });