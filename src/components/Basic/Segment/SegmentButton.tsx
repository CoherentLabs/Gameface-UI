import { onCleanup, onSettled, ParentComponent, ParentProps, untrack, useContext } from "solid-js";
import { JSX } from "@solidjs/web";
import { SegmentContext } from "./Segment";
import { ComponentProps } from "@components/types/ComponentProps";
import styles from './Segment.module.scss';
import { createTokenComponent } from "@components/utils/tokenComponents";
import baseComponent from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";

interface SegmentButtonProps extends ParentProps, ComponentProps {
    style?: JSX.CSSProperties,
    class?: string,
    value: string,
    disabled?: boolean,
    selected?: boolean,
    'class-disabled'?: string,
    'class-selected'?: string,
}

export const Button = createTokenComponent<SegmentButtonProps>();

export const SegmentButton: ParentComponent<{ button: SegmentButtonProps }> = (props) => {
    const segment = useContext(SegmentContext);
    let element: HTMLDivElement | undefined;

    const isSelected = () => segment?.selected() === props.button.value;

    const handleClick = (e?: MouseEvent) => {
        if (props.button.disabled) return;

        segment?.selectOption(props.button.value);
        props.button.click?.(e as MouseEvent);
    }

    // Register once mounted: selecting reads the button's offsetLeft/Width.
    onSettled(() => {
        untrack(() => {
            if (element) segment?.registerOption(props.button.value, element, props.button.selected);
        });
    })

    onCleanup(() => {
        untrack(() => segment?.unregisterOption(props.button.value));
    })

    return (
        <div
            class={[
                styles['segment-button'],
                props.button.disabled && styles.disabled,
                props.button.disabled && props.button['class-disabled'],
                isSelected() && styles.selected,
                isSelected() && props.button['class-selected'],
                isSelected() && segment?.firstRender() && styles['first-render'],
                props.button.class,
            ]}
            style={props.button.style}
            ref={[(node: HTMLDivElement) => { element = node; }, exposeRef(props.button), baseComponent(props.button)]}
            onClick={handleClick}>
            <div class={styles.content}>
                {props.button.children}
            </div>
        </div>
    )
}
