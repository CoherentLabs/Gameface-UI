import { Accessor, createEffect, createMemo, JSX, onCleanup, onMount, ParentComponent, ParentProps, useContext } from "solid-js";
import { SegmentContext } from "./Segment";
import { ComponentProps } from "@components/types/ComponentProps";
import styles from './Segment.module.scss';
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { createTokenComponent } from "@components/utils/tokenComponents";

interface SegmentButtonProps extends ParentProps, ComponentProps {
    style?: JSX.CSSProperties,
    class?: string,
    value: string,
    disabled?: boolean,
    selected?: boolean,
    'class-disabled'?: string,
}

export const Button = createTokenComponent<SegmentButtonProps>();

export const SegmentButton: ParentComponent<{ button: SegmentButtonProps }> = (props) => {
    const segment = useContext(SegmentContext);
    let element!: HTMLDivElement;

    const isSelected = () => segment?.selected() === props.button.value;

    const buttonClasses = createMemo(() => {
        const classes = [styles['segment-button']];

        if (props.button.disabled) {
            if (props.button['class-disabled']) classes.push(`${styles.disabled} ${props.button['class-disabled']}`);
            else classes.push(styles.disabled);
        }

        if (isSelected()) {
            classes.push(styles.selected);
            
            if (segment?.firstRender()) {
                classes.push(styles['first-render']);
            }
        }


        return classes.join(' ');
    });

    props.button.componentClasses = () => buttonClasses();

    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props.button);

    const handleClick = (e?: MouseEvent) => {
        if (props.button.disabled) return;

        segment?.selectOption(props.button.value);
        props.button.click?.(e as MouseEvent);
    }

    onMount(() => {
        if (props.button.ref) (props.button.ref as unknown as (ref: any) => void)(element);

        segment?.registerOption(props.button.value, element, props.button.selected)
    })
    
    onCleanup(() => {
        segment?.unregisterOption(props.button.value);
    })

    return (
        <div
            ref={element}
            class={className()}
            style={inlineStyles()}
            use:forwardEvents={props}
            use:forwardAttrs={props}
            onclick={handleClick}>
            <div class={styles.content}>
                {props.button.children}
            </div>
        </div>
    )
}
