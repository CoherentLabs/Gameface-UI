import { BaseComponentRef, ComponentProps } from "@components/types/ComponentProps";
import { Accessor, Setter, createSignal, ParentComponent, Show, createContext, createMemo, createEffect } from "solid-js";
import styles from './ToggleButton.module.scss';
import { Control, ToggleButtonControl } from "./ToggleButtonControl";
import { Indicator } from "./ToggleButtonIndicator";
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { Handle } from "./ToggleButtonHandle";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";

export const LabelLeft = createTokenComponent();
export const LabelRight = createTokenComponent();

export interface ToggleButtonRef extends BaseComponentRef {
    checked: Accessor<boolean>,
    setChecked: Setter<boolean>,
}

interface ToggleButtonProps extends ComponentProps<ToggleButtonRef> {
    checked?: boolean
    disabled?: boolean
    'class-disabled'?: string
    'class-checked'?: string
    onChange?: (checked: boolean) => void;
}


export const ToggleButtonContext = createContext<{ checked: Accessor<boolean> }>();

const ToggleButton: ParentComponent<ToggleButtonProps> = (props) => {
    const LabelLeftToken = useToken(LabelLeft, () => props.children);
    const LabelRightToken = useToken(LabelRight, () => props.children);

    const [checked, setChecked] = createSignal(props.checked ?? false);

    createEffect(
        () => props.checked,
        (checked) => {
        if (checked !== undefined) {
            setChecked(checked);
        }
    });

    const toggleButtonClasses = createMemo(() => {
        const classes = [styles['toggle-button']];

        if (props.disabled) {
            if (props['class-disabled']) classes.push(`${styles.disabled} ${props['class-disabled']}`);
            else classes.push(styles.disabled);
        }

        if (checked() && props['class-checked']) {
            classes.push(`${props['class-checked']}`);
        }

        return classes.join(' ');
    });


    props.componentClasses = () => toggleButtonClasses();
    props.refObject = {
        checked,
        setChecked,
    }

    const toggle = () => {
        if (props.disabled) return;

        setChecked(prev => !prev);
    }

    createEffect(checked, (v) => {
        props.onChange?.(v);
    }, {defer: true})

    return (
        <ToggleButtonContext value={{ checked }}>
            <div
                ref={[
                    baseComponent(props), 
                    navigationActions(mergeNavigationActions(props, {'select': toggle}))]}
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