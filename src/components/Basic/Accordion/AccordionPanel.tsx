import { createMemo, JSX, ParentComponent, ParentProps, useContext } from "solid-js";
import { TokenComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent } from "@components/utils/tokenComponents";
import styles from './Accordion.module.css';
import { AccordionBody } from "./AccordionBody";
import { AccordionHeading } from "./AccordionHeading";
import { AccordionContext, PanelData } from "./Accordion";

export interface PanelChildrenComponentProps extends TokenComponentProps {
    isExpanded: () => boolean;
}

export interface PanelTokenProps extends ParentProps {
    expanded?: boolean;
    title?: string;
    disabled?: boolean;
    'class-disabled'?: string;
    'class-expanded'?: string,
    style?: JSX.CSSProperties;
    class?: string;
}

export interface CommonAccordionSlotProps extends ParentProps {
    style?: JSX.CSSProperties,
    class?: string,
}

export const Panel = createTokenComponent<PanelTokenProps>();

export const AccordionPanel: ParentComponent<PanelData> = (props) => {
    const accordion = useContext(AccordionContext);
    const isExpanded = createMemo(() => accordion!.expandedPanels().includes(props.id));

    const panelClasses = createMemo(() => {
        const classes = [styles.Panel];

        classes.push(props.panel.class ?? '');

        if (props.panel.disabled) {
            classes.push(styles.Disabled);
            classes.push(props.panel["class-disabled"] ?? '');
        }
        
        if (isExpanded()) classes.push(props.panel['class-expanded'] ?? '');

        return classes.join(' ');
    });

    return (
        <div
            class={panelClasses()}
            style={props.panel?.style} >
                <AccordionHeading id={props.id} isExpanded={isExpanded} parentChildren={props.panel.children} />
                <AccordionBody isExpanded={isExpanded} parentChildren={props.panel.children} />
        </div>
    )
}
