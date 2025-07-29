import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import selectors from "../../../shared/pagination-selectors.json";
import Pagination, { PaginationRef } from "@components/Basic/Pagination/Pagination";
import "./pagination.css" 

const PaginationTest = () => {
    let paginationRef!: PaginationRef;
    const [reactivity, setReactivity] = createSignal(false);
    const [index, setIndex] = createSignal(1);
    const [size, setSize] = createSignal(5);
    const [hasNumber, setHasNumbers] = createSignal(true);
    const [shouldLoop, setShouldLoop] = createSignal(false);
    const [customBtn, setCustomBtn] = createSignal(false);

    const scenarios = [
        { label: "Select option with ref", action: () => paginationRef?.changeIndex(3) },
        { label: "Next page with ref", action: () => paginationRef?.nextPage() },
        { label: "Previous page with ref", action: () => paginationRef?.previousPage() },
        { label: "Change page size", action: () => setSize(10)},
        { label: "Remove numbers", action: () => setHasNumbers(false)},
        { label: "Enable loop", action: () => setShouldLoop(true) },
        { label: "Enable custom control", action: () => setCustomBtn(true) },
        { label: "Test reactivity", action: () => setReactivity(true) },
    ];

    const reset = () => {
        paginationRef?.changeIndex(1)
        setReactivity(false);
        setIndex(1);
        setSize(5);
        setShouldLoop(false);
        setCustomBtn(false);
    };

    const isReactive = createMemo(() => reactivity() === true);
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset)) 

    return (
        <Tab location='pagination'>
            <div class={selectors.assertionElement}>{index()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <Pagination 
                ref={paginationRef}
                onChange={(value) => setIndex(value)} 
                loop={shouldLoop()}
                pageIndex={index()}
                pageSize={size()}
                hasNumbers={hasNumber()}
                style={reactiveStyle()} 
                class={`${selectors.pagination} ${reactiveClass()}`}>
                <Pagination.Item 
                    class={`${selectors.paginationItem} ${reactiveClass()}`}
                    style={reactiveStyle()} />
                <Show when={!customBtn()}>
                    <Pagination.Control style={reactiveStyle()} class={`${selectors.paginationControl} ${reactiveClass()}`} />
                </Show>
                <Show when={customBtn()}>
                    <Pagination.Control hidden-class={selectors.controlHidden} class={selectors.paginationControl}>
                        <div class={selectors.paginationCustomControl}></div>
                    </Pagination.Control>
                </Show>
            </Pagination>
        </Tab>
    )
}

export default PaginationTest;