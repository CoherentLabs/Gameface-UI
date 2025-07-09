import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import selectors from '../../../shared/accordion-selectors.json';
import Accordion, { AccordionRef } from "@components/Basic/Accordion/Accordion";
import './accordion.css';

const accordionPanels = [
    { title: 'test1', },
    { title: 'test2', },
    { title: 'test3', },
]

const AccordionTest = () => {
    let accordionRef!: AccordionRef;
    const [expanded, setExpanded] = createSignal(''); 
    const [multiple, setMultiple] = createSignal(false);
    const [disabled, setDisabled] = createSignal(false);
    const [panelDisabled, setPanelDisabled] = createSignal(false);
    const [customIcon, setCustomIcon] = createSignal(false);
    const [reactive, setReactive] = createSignal(false);

    const scenarios = [
        { label: "Enable multiple", action: () => setMultiple(true) },
        { label: "Disable accordion", action: () => setDisabled(true) },
        { label: "Disable accordion panel", action: () => setPanelDisabled(true) },
        { label: "Enable reactive styles", action: () => setReactive(true) },
        { label: "Expand a panel programatically", action: () => accordionRef.expand('test1') },
        { label: "Expand all panels programatically", action: () => accordionRef.expandAll() },
        { label: "Collapse a panel programatically", action: () => accordionRef.collapse('test1') },
        { label: "Collapse all panels programatically", action: () => accordionRef.collapseAll() },
        { label: "Render custom icon", action: () => setCustomIcon(true) },
    ];

    const reset = () => {
        setMultiple(false);
        setDisabled(false);
        setPanelDisabled(false);
        setReactive(false);
        setCustomIcon(false);
        accordionRef.collapseAll();
    };

    const isReactive = createMemo(() => reactive() === true);
    const reactiveClass = createMemo(() => isReactive() ? selectors.reactive : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset))

    return (
        <Tab location='accordion'>
            <div class={selectors.assertionElement}>{expanded()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <Accordion 
                ref={accordionRef}
                class={`${selectors.base} ${reactiveClass()}`}
                style={reactiveStyle()}
                onChange={(expanded) => setExpanded(expanded)} 
                multiple={multiple()}
                disabled={disabled()}
                class-disabled={selectors.accordionDisabled} >
                <For each={accordionPanels}>
                    {(item => (
                        <Accordion.Panel 
                            title={item.title}
                            disabled={panelDisabled()}
                            class-disabled={selectors.panelDisabled}
                            class-expanded={selectors.panelExpanded}
                            class={`${selectors.accordionPanel} ${reactiveClass()}`}
                            style={reactiveStyle()}>
                            <Accordion.Heading class={`${selectors.accordionHeading} ${reactiveClass()}`} style={reactiveStyle()}>
                                {item.title}
                                <Accordion.Icon class={`${selectors.accordionIcon} ${reactiveClass()}`} style={reactiveStyle()}>
                                    {customIcon() && 'Custom icon'}
                                </Accordion.Icon>
                            </Accordion.Heading>
                            <Accordion.Body class={`${selectors.accordionBody} ${reactiveClass()}`} style={reactiveStyle()}>
                                {item.title}
                            </Accordion.Body>
                        </Accordion.Panel>
                    ))}
                </For>
            </Accordion>
        </Tab>
    )
}

export default AccordionTest;