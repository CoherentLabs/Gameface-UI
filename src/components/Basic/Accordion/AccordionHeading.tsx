import { JSX, ParentComponent, ParentProps } from "solid-js";
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import AccordionIcon from './AccordionIcon.svg?component-solid'
import styles from './Accordion.module.css';
import { PanelChildrenComponentProps } from "./AccordionPanel";

interface CommonSlotProps extends ParentProps {
    style?: JSX.CSSProperties,
    class?: string,
}

export const Heading = createTokenComponent<CommonSlotProps>();
export const Icon = createTokenComponent<CommonSlotProps>();

export const AccordionHeading: ParentComponent<PanelChildrenComponentProps> = (props) => {
    const HeadingToken = useToken(Heading, props.parentChildren);
    const IconToken = useToken(Icon, HeadingToken?.()?.children)

    return (
        <div
            class={`${styles.Heading} ${HeadingToken()?.class || ''}`}
            style={HeadingToken()?.style}>
            <div class={`${styles['Heading-content']}`}>{HeadingToken()?.children}</div>
            <div 
                class={`${styles.Icon} ${IconToken?.()?.class || ''} ${props.isExpanded() ? styles['Icon-expanded'] : ''}`}
                style={IconToken?.()?.style}>
                {IconToken?.()?.children || <AccordionIcon />}
            </div>
        </div>
    )
}
