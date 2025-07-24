import { createEffect, createMemo, createSignal, JSX, onMount, ParentComponent } from "solid-js";
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import styles from './Accordion.module.scss';
import { waitForFrames } from "@components/utils/waitForFrames";
import { CommonAccordionSlotProps, PanelChildrenComponentProps } from "./AccordionPanel";

export const Body = createTokenComponent<CommonAccordionSlotProps>();

export const AccordionBody: ParentComponent<PanelChildrenComponentProps> = (props) => {
    const BodyToken = useToken(Body, props.parentChildren);
    const [height, setHeight] = createSignal(0);
    let element!: HTMLDivElement;

    const bodyStyles = createMemo(() => {
        return {
            height: props.isExpanded() ? `${height()}px` : '0px',
        };
    })

    const handleExpand = () => {
        if (props.isExpanded()) setHeight(element.scrollHeight)
    }

    createEffect(() => {
        handleExpand();
    });

    onMount(() => {
        waitForFrames(() => {
            handleExpand();
        }, 3)
    })

    return (
        <div
            ref={element}
            class={`${styles.body}`}
            style={bodyStyles()}>
            <div
                class={`${styles.content} ${BodyToken()?.class || ''}`}
                style={BodyToken()?.style}>
                {BodyToken()?.children}
            </div>
        </div>
    )
}
