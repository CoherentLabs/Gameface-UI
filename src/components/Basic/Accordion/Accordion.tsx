import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createContext, createMemo, createSignal, createUniqueId, For, onMount, ParentComponent } from "solid-js";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { AccordionPanel, Panel, PanelTokenProps } from "./AccordionPanel";
import { Heading, Icon } from "./AccordionHeading";
import { Body } from "./AccordionBody";
import { useTokens } from "@components/utils/tokenComponents";
import styles from './Accordion.module.scss';

export interface AccordionRef {
    element: HTMLDivElement,
    expandAll: () => void,
    collapseAll: () => void,
    expand: (title: string) => void,
    collapse: (title: string) => void,
}

export interface PanelData { 
    panel: PanelTokenProps;
    id: string 
}

interface AccordionProps extends Omit<ComponentProps, 'onAction' | 'anchor'> {
    multiple?: boolean;
    disabled?: boolean;
    'class-disabled'?: string;
    onChange?: (title: string) => void;
}

interface AccordionContext {
    expandedPanels: Accessor<Array<string>>,
    toggle: (id: string) => void,
}

function initPanels(panelData: PanelData[], multiple = false): string[] {
    const arr: string[] = [];

    for (const { panel, id } of panelData) {
        if (!panel.expanded) continue;

        if (multiple) {
            arr.push(id);
        } else {
            return [id]; 
        }
    }

    return arr;
}

export const AccordionContext = createContext<AccordionContext>();

const Accordion: ParentComponent<AccordionProps> = (props) => {
    let element!: HTMLDivElement;
    const PanelTokens = useTokens(Panel, props.children);
    const panelData = createMemo(() =>
        PanelTokens()?.map(panel => ({
            id: panel.title ?? createUniqueId(),
            panel,
        }))
    );

    const [expandedPanels, setExpandedPanels] = createSignal<string[]>(initPanels(panelData()!, props.multiple));

    const toggle = (id: string) => {
        setExpandedPanels(prev => {
            if (!props.multiple) {
                return prev[0] === id ? [] : [id]
            };

            return prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id];
        })

        props.onChange?.(id);
    }

    const expandAll = () => {
        if (!props.multiple) return console.error('Accordion must be multiple to execute this method');

        const data = panelData();
        if (!data || data.length === 0) {
            return console.error('No panels to expand!');
        }

        setExpandedPanels(
            props.multiple
                ? data.map(d => d.id)
                : [data[0].id]
        );
    }

    const collapseAll = () => {
        const data = panelData();
        if (!data || data.length === 0) {
            return console.error('No panels to collapse!');
        }

        setExpandedPanels([]);
    }

    const expand = (title: string) => {
        const data = panelData();

        if (!data || data.length === 0) {
            return console.error('No panels to expand!');
        }

        if (!data.find((panel) => panel.id === title)) {
            return console.error(`There is no panel with title: ${title}`);
        }

        toggle(title);
    }

    const collapse = (title: string) => {
        const data = panelData();

        if (!data || data.length === 0) {
            return console.error('No panels to collapse!');
        }

        if (!data.find((panel) => panel.id === title)) {
            return console.error(`There is no panel with title: ${title}`);
        }

        setExpandedPanels(prev => {
            if (!props.multiple) return [];

            return prev.filter(id => id !== title);
        })

        props.onChange?.(title);
    }

    const accordionClasses = createMemo(() => {
        const classes = [styles.accordion];

        if (props.disabled) {
            classes.push(styles.disabled);
            classes.push(props["class-disabled"] ?? '');
        }

        return classes.join(' ');
    });

    props.componentClasses = () => accordionClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            element,
            expand,
            collapse,
            expandAll,
            collapseAll
        });
    });

    return (
        <AccordionContext.Provider value={{ expandedPanels, toggle }}>
            <div
                ref={element!}
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props}
                use:forwardAttrs={props}>
                <For each={panelData()}>
                    {(data) => <AccordionPanel id={data.id} panel={data.panel} />}
                </For>
            </div>
        </AccordionContext.Provider>
    )
}

export default Object.assign(Accordion, { Panel, Body, Heading, Icon });