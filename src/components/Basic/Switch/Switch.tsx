import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, Setter, createSignal, onMount, ParentComponent, Show, createContext, createMemo, createEffect } from "solid-js";
import styles from './Switch.module.css';
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { Control, SwitchControl } from "./SwitchControl";
import { Indicator } from "./SwitchIndicator";
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { Handle } from "./SwitchHandle";

export const LabelLeft = createTokenComponent();
export const LabelRight = createTokenComponent();

export interface SwitchRef {
    checked: Accessor<boolean>,
    setChecked: Setter<boolean>,
    element: HTMLDivElement,
}

interface SwitchProps extends ComponentProps {
    checked?: boolean
    disabled?: boolean
    'class-disabled'?: string
    'class-checked'?: string
    onChange?: (checked: boolean) => void;
}


export const SwitchContext = createContext<{ checked: Accessor<boolean> }>();

const Switch: ParentComponent<SwitchProps> = (props) => {
    const LabelLeftToken = useToken(LabelLeft, props.children);
    const LabelRightToken = useToken(LabelRight, props.children);

    const [checked, setChecked] = createSignal(props.checked ?? false);
    let element!: HTMLDivElement;

    const switchClasses = createMemo(() => {
        const classes = [styles.Switch];

        if (props.disabled) {
            if (props['class-disabled']) classes.push(`${styles.Disabled} ${props['class-disabled']}`);
            else classes.push(styles.Disabled);
        }

        if (checked() && props['class-checked']) {
            classes.push(`${props['class-checked']}`);
        }

        return classes.join(' ');
    });


    props.componentClasses = () => switchClasses();
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
            setChecked,
            element,
        });
    });

    return (
        <SwitchContext.Provider value={{ checked }}>
            <div
                ref={element!}
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props}
                use:forwardAttrs={props}
                onclick={toggle}>

                <Show when={LabelLeftToken()}>
                    {LabelLeftToken()?.children}
                </Show>

                <SwitchControl parentChildren={props.children} />

                <Show when={LabelRightToken()}>
                    {LabelRightToken()?.children}
                </Show>
            </div>
        </SwitchContext.Provider>
    )
}

export default Object.assign(Switch, { LabelLeft, LabelRight, Control, Indicator, Handle });