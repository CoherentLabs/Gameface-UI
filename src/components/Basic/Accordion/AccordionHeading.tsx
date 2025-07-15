import { JSX, ParentComponent, ParentProps, useContext } from "solid-js";
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import AccordionIcon from './AccordionIcon.svg?component-solid'
import styles from './Accordion.module.css';
import { CommonAccordionSlotProps, PanelChildrenComponentProps } from "./AccordionPanel";
import { AccordionContext } from "./Accordion";

export const Heading = createTokenComponent<CommonAccordionSlotProps>();
export const Icon = createTokenComponent<CommonAccordionSlotProps>();

export const AccordionHeading: ParentComponent<{ id: string } & PanelChildrenComponentProps> = (props) => {
    const HeadingToken = useToken(Heading, props.parentChildren);
    const IconToken = useToken(Icon, HeadingToken?.()?.children)
    const accordion = useContext(AccordionContext)

    return (
        <div
            class={`${styles.Heading} ${HeadingToken()?.class || ''}`}
            style={HeadingToken()?.style}
            onclick={() => accordion?.toggle(props.id)}>
            <div class={`${styles['Heading-content']}`}>{HeadingToken()?.children}</div>
            <div 
                class={`${styles.Icon} ${IconToken?.()?.class || ''} ${props.isExpanded() ? styles['Icon-expanded'] : ''}`}
                style={IconToken?.()?.style}>
                {IconToken?.()?.children || <AccordionIcon />}
            </div>
        </div>
    )
}
