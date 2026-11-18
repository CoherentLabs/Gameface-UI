import { createEffect, createMemo, createSignal, onSettled, ParentComponent } from "solid-js";
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import styles from './Accordion.module.scss';
import { waitForFrames } from "@components/utils/waitForFrames";
import { CommonAccordionSlotProps, PanelChildrenComponentProps } from "./AccordionPanel";

export const Body = createTokenComponent<CommonAccordionSlotProps>();

export const AccordionBody: ParentComponent<PanelChildrenComponentProps> = (props) => {
    const BodyToken = useToken(Body, () => props.parentChildren);
    const [height, setHeight] = createSignal(0);
    let element: HTMLDivElement | undefined;

    const bodyStyles = createMemo(() => {
        return {
            height: props.isExpanded() ? `${height()}px` : '0px',
        };
    })

    const measure = () => {
        if (element) setHeight(element.scrollHeight);
    }

    // Re-measure the content whenever the panel expands.
    createEffect(
        () => props.isExpanded(),
        (expanded) => { if (expanded) measure(); }
    );

    onSettled(() => {
        waitForFrames(() => {
            if (props.isExpanded()) measure();
        }, 3)
    })

    return (
        <div
            ref={element}
            class={styles.body}
            style={bodyStyles()}>
            <div
                class={[styles.content, BodyToken()?.class]}
                style={BodyToken()?.style}>
                {BodyToken()?.children}
            </div>
        </div>
    )
}
