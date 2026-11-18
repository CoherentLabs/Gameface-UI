import { onCleanup, onSettled, ParentComponent, ParentProps, Show, untrack, useContext } from "solid-js";
import { JSX } from "@solidjs/web";
import styles from './Stepper.module.scss';

import { createTokenComponent } from "@components/utils/tokenComponents";
import { StepperContext } from "./Stepper";
import Flex from "@components/Layout/Flex/Flex";

interface ItemTokenProps {
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
    onSettled(() => {
        untrack(() => stepperContext?.registerOption(props.item.value, props.item.selected));
    })

    onCleanup(() => {
        untrack(() => stepperContext?.unregisterOption(props.item.value));
    })

    return (
        <Show when={stepperContext?.selected() === props.item.value}>
            <div
                class={[styles['stepper-item'], props.item.class]}
                style={props.item.style || {}}>
                {props.item.children}
            </div>
        </Show>
    )
}
