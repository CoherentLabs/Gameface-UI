import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createContext, createMemo, createSignal, createUniqueId, For, ParentComponent, untrack } from "solid-js";
import { AccordionPanel, Panel, PanelTokenProps } from "./AccordionPanel";
import { Heading, Icon } from "./AccordionHeading";
import { Body } from "./AccordionBody";
import { useTokens } from "@components/utils/tokenComponents";
import baseComponent from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";
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

// `null` default (pattern 1.3.o).
export const AccordionContext = createContext<AccordionContext | null>(null);

const Accordion: ParentComponent<AccordionProps> = (props) => {
    const PanelTokens = useTokens(Panel, () => props.children);
    const panelData = createMemo(() =>
        PanelTokens()?.map(panel => ({
            id: panel.title ?? createUniqueId(),
            panel,
        }))
    );

    // Initially expanded panels, read once as in 1.x.
    const initialPanels = untrack(() => initPanels(panelData() ?? [], props.multiple));
    const [expandedPanels, setExpandedPanelsSignal] = createSignal<string[]>(initialPanels);
    // Always-current plain copy (Solid 2 stages signal writes).
    let current = initialPanels;
    const setExpandedPanels = (next: string[]) => {
        current = next;
        setExpandedPanelsSignal(next);
    };

    // onChange reports the toggled panel at the write, once per toggle.
    const toggle = (id: string) => {
        if (!props.multiple) {
            setExpandedPanels(current[0] === id ? [] : [id]);
        } else {
            setExpandedPanels(current.includes(id) ? current.filter(i => i !== id) : [...current, id]);
        }

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

        // Already expanded: nothing to do (1.x toggled it, so expand() collapsed an open panel).
        if (current.includes(title)) return;

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

        // Not expanded: nothing to do (1.x reported it anyway, and in single mode collapsed whichever panel was open).
        if (!current.includes(title)) return;

        setExpandedPanels(current.filter(id => id !== title));

        props.onChange?.(title);
    }

    return (
        <AccordionContext value={{ expandedPanels, toggle }}>
            <div
                class={[styles.accordion, props.disabled && styles.disabled, props.disabled && props["class-disabled"], props.class]}
                style={props.style}
                ref={[
                    exposeRef<Omit<AccordionRef, 'element'>>(props, { expand, collapse, expandAll, collapseAll }),
                    baseComponent(props),
                ]}
            >
                <For each={panelData()}>
                    {(data) => <AccordionPanel id={data.id} panel={data.panel} />}
                </For>
            </div>
        </AccordionContext>
    )
}

export default Object.assign(Accordion, { Panel, Body, Heading, Icon });
