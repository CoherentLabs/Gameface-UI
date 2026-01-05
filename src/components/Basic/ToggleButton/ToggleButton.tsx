import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, Setter, createSignal, onMount, ParentComponent, Show, createContext, createMemo, createEffect, on } from "solid-js";
import styles from './ToggleButton.module.scss';
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { Control, ToggleButtonControl } from "./ToggleButtonControl";
import { Indicator } from "./ToggleButtonIndicator";
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { Handle } from "./ToggleButtonHandle";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";

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


export const ToggleButtonContext = createContext<{ checked: Accessor<boolean> }>();

const ToggleButton: ParentComponent<ToggleButtonProps> = (props) => {
    const LabelLeftToken = useToken(LabelLeft, props.children);
    const LabelRightToken = useToken(LabelRight, props.children);

    const [checked, setChecked] = createSignal(props.checked ?? false);
    let element!: HTMLDivElement;

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
    const { className, inlineStyles, forwardEvents, forwardAttrs, navigationActions } = useBaseComponent(props);

    const toggle = () => {
        if (props.disabled) return;

        setChecked(prev => !prev);
    }

    createEffect(
        on(checked, (v) => {
            props.onChange?.(v);
        }, {defer: true})
    );

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            checked,
            setChecked,
            element,
        });
    });

    return (
        <ToggleButtonContext.Provider value={{ checked }}>
            <div
                ref={element!}
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props}
                use:forwardAttrs={props}
                use:navigationActions={mergeNavigationActions(props, {'select': toggle})}
                onclick={toggle}>

                <Show when={LabelLeftToken()}>
                    {LabelLeftToken()?.children}
                </Show>

                <ToggleButtonControl parentChildren={props.children} />

                <Show when={LabelRightToken()}>
                    {LabelRightToken()?.children}
                </Show>
            </div>
        </ToggleButtonContext.Provider>
    )
}

export default Object.assign(ToggleButton, { LabelLeft, LabelRight, Control, Indicator, Handle });