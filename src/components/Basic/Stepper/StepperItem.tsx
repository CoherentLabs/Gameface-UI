import { JSX, onCleanup, onMount, ParentComponent, ParentProps, Show, useContext } from "solid-js";
import styles from './Stepper.module.scss';

import { createTokenComponent, TokenBase } from "@components/utils/tokenComponents";
import { forwardAttrs } from "@components/BaseComponent/BaseComponent";
import { StepperContext } from "./Stepper";
import Flex from "@components/Layout/Flex/Flex";

interface ItemTokenProps extends TokenBase {
    style?: JSX.CSSProperties,
    class?: string,
    selected?: boolean
    value: string
}

export const Item = createTokenComponent<ItemTokenProps>();

interface StepperItempProps {
    item: ParentProps<ItemTokenProps>
}

export const StepperItem: ParentComponent<StepperItempProps> = (props) => {
    const stepperContext = useContext(StepperContext);
    onMount(() => {
        stepperContext?.registerOption(props.item.value, props.item.selected);
    })

    onCleanup(() => {
        stepperContext?.unregisterOption(props.item.value);
    })

    return (
        <Show when={stepperContext?.selected() === props.item.value}>
            <div
                class={`${styles['stepper-item']} ${props.item.class || ''}`}
                style={props.item.style || {}}
                use:forwardAttrs={props.item}>
                {props.item.children}
            </div>
        </Show>
    )
}
