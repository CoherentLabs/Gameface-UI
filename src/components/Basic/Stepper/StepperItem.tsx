import { JSX, onCleanup, onMount, ParentComponent, ParentProps, Show, useContext } from "solid-js";
import styles from './Stepper.module.css';

import { createTokenComponent } from "@components/utils/tokenComponents";
import { StepperContext } from "./Stepper";
import Flex from "@components/Layout/Flex/Flex";

interface ItemTokenProps {
    style?: JSX.CSSProperties,
    class?: string,
    'class-selected'?: string
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
            <Flex align-items="center"
                justify-content="center"
                class={`${styles.StepperItem} ${props.item.class || ''}`}
                style={props.item.style || {}}>
                {props.item.children}
            </Flex>
        </Show>
    )
}
