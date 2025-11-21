import { JSX, ParentComponent, ParentProps, useContext } from "solid-js";
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import AccordionIcon from './AccordionIcon.svg?component-solid'
import styles from './Accordion.module.scss';
import { CommonAccordionSlotProps, PanelChildrenComponentProps } from "./AccordionPanel";
import { AccordionContext } from "./Accordion";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { ComponentNavigationActions } from "@components/types/ComponentProps";

interface AccordionHeadingProps extends CommonAccordionSlotProps {
    onAction?: ComponentNavigationActions,
    anchor?: string | HTMLElement,
}

export const Heading = createTokenComponent<AccordionHeadingProps>();
export const Icon = createTokenComponent<CommonAccordionSlotProps>();

export const AccordionHeading: ParentComponent<{ id: string, onAction?: Record<string, () => void> } & PanelChildrenComponentProps> = (props) => {
    const HeadingToken = useToken(Heading, props.parentChildren);
    const IconToken = useToken(Icon, HeadingToken?.()?.children)
    const accordion = useContext(AccordionContext)

    const { navigationActions } = useBaseComponent({} as any);

    return (
        <div
            class={`${styles.heading} ${HeadingToken()?.class || ''}`}
            style={HeadingToken()?.style}
            onclick={() => accordion?.toggle(props.id)}
            use:navigationActions={mergeNavigationActions(HeadingToken() as any, {
                'select': () => accordion?.toggle(props.id)
            })}>
            <div class={`${styles['heading-content']}`}>{HeadingToken()?.children}</div>
            <div
                class={`${styles.icon} ${IconToken?.()?.class || ''} ${props.isExpanded() ? styles['icon-expanded'] : ''}`}
                style={IconToken?.()?.style}>
                {IconToken?.()?.children || <AccordionIcon />}
            </div>
        </div>
    )
}
