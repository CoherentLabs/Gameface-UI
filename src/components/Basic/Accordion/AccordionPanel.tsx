import { createMemo, ParentComponent, ParentProps, useContext } from "solid-js";
import { TokenComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent, TokenBase } from "@components/utils/tokenComponents";
import { forwardAttrs } from "@components/BaseComponent/BaseComponent";
import styles from './Accordion.module.scss';
import { AccordionBody } from "./AccordionBody";
import { AccordionHeading } from "./AccordionHeading";
import { AccordionContext, PanelData } from "./Accordion";

export interface PanelChildrenComponentProps extends TokenComponentProps {
    isExpanded: () => boolean;
}

export interface PanelTokenProps extends ParentProps<TokenBase> {
    expanded?: boolean;
    title?: string;
    disabled?: boolean;
    'class-disabled'?: string;
    'class-expanded'?: string,
}

export interface CommonAccordionSlotProps extends ParentProps<TokenBase> { }

export const Panel = createTokenComponent<PanelTokenProps>();

export const AccordionPanel: ParentComponent<PanelData> = (props) => {
    const accordion = useContext(AccordionContext);
    const isExpanded = createMemo(() => accordion!.expandedPanels().includes(props.id));

    const panelClasses = createMemo(() => {
        const classes = [styles.panel];

        classes.push(props.panel.class ?? '');

        if (props.panel.disabled) {
            classes.push(styles.disabled);
            classes.push(props.panel["class-disabled"] ?? '');
        }
        
        if (isExpanded()) classes.push(props.panel['class-expanded'] ?? '');

        return classes.join(' ');
    });

    return (
        <div
            class={panelClasses()}
            style={props.panel?.style}
            use:forwardAttrs={props.panel}>
                <AccordionHeading id={props.id} isExpanded={isExpanded} parentChildren={props.panel.children} />
                <AccordionBody isExpanded={isExpanded} parentChildren={props.panel.children} />
        </div>
    )
}
