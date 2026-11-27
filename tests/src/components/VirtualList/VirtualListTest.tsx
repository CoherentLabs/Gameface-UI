import { createMemo, createSignal, onCleanup, onMount, Show } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import VirtualList, { VirtualListRef } from '@components/Layout/VirtualList/VirtualList';
import './VirtualListTest.css';

import selectors from '../../../shared/virtual-list-selectors.json';

// Keep in sync with tests/specs/virtual-list.spec.js
const ITEM_COUNT = 10;
const START = 2;
const PAGE = 3;

type Target = 'keyed' | 'unkeyed' | 'bound';

/** Items of the plain-array list, for the row recompute test */
const PLAIN_ITEMS = [0, 1, 2, 3, 4];

interface Item {
    id: number;
    name: string;
}

const makeItems = (ids: number[], suffix = '') => ids.map((id) => ({ id, name: `item${id}${suffix}` }));
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/** Counts created rows, so kept rows can be told apart from recreated ones. */
let created = 0;

const Row = (props: { item: Item; index: number }) => {
    const uid = ++created;
    return (
        <div class={selectors.row} data-uid={uid} data-id={props.item.id} data-index={props.index}>
            {props.item.name}
        </div>
    );
};

const VirtualListTest = () => {
    const [mounted, setMounted] = createSignal(true);
    const [store, setStore] = createStore<{ items: Item[] }>({ items: makeItems(range(ITEM_COUNT)) });
    const [start, setStart] = createSignal(START);
    const [page, setPage] = createSignal(PAGE);
    // A list whose startIndex and pageSize are bound to signals that the ref's moves write back to
    const [boundStart, setBoundStart] = createSignal(START);
    const [boundPage, setBoundPage] = createSignal(PAGE);
    // A plain array (not a store), so replacing one item replaces the whole array
    const [plain, setPlain] = createSignal(PLAIN_ITEMS);
    const [recomputes, setRecomputes] = createSignal(0);
    const refs: Partial<Record<Target, VirtualListRef>> = {};

    const onProps = (event: Event) => {
        const { start: s, page: p } = (event as CustomEvent<{ start?: number; page?: number }>).detail;
        if (s !== undefined) setStart(s);
        if (p !== undefined) setPage(p);
    };
    const onItems = (event: Event) => {
        const { ids, suffix } = (event as CustomEvent<{ ids: number[]; suffix?: string }>).detail;
        setStore('items', reconcile(makeItems(ids, suffix), { key: 'id' }));
    };
    /** Calls a ref method or sets a ref property; `value` undefined = method call. */
    const onRef = (event: Event) => {
        const { target, name, value } = (event as CustomEvent<{ target: Target; name: string; value?: number }>).detail;
        const ref = refs[target] as any;
        if (!ref) return;
        if (value === undefined) ref[name]();
        else ref[name] = value;
    };
    /** Writes the ref's values to the document, for the spec to read. */
    const onReadRef = (event: Event) => {
        const ref = refs[(event as CustomEvent<{ target: Target }>).detail.target];
        document.body.setAttribute(
            'data-vl-ref',
            JSON.stringify(ref ? { startIndex: ref.startIndex, pageSize: ref.pageSize, length: ref.length } : null)
        );
    };
    const onBound = (event: Event) => {
        const { start: s, page: p } = (event as CustomEvent<{ start?: number; page?: number }>).detail;
        if (s !== undefined) setBoundStart(s);
        if (p !== undefined) setBoundPage(p);
    };
    /** Replaces the plain array with a copy where one item changed */
    const onPlain = (event: Event) => {
        const { index, value } = (event as CustomEvent<{ index: number; value: number }>).detail;
        const next = [...plain()];
        next[index] = value;
        setPlain(next);
    };
    const reset = () => {
        setMounted(false);
        created = 0;
        setStore('items', makeItems(range(ITEM_COUNT)));
        setStart(START);
        setPage(PAGE);
        setBoundStart(START);
        setBoundPage(PAGE);
        setPlain(PLAIN_ITEMS);
        setRecomputes(0);
        setMounted(true);
    };

    const listeners: [string, (e: Event) => void][] = [
        ['vl-props', onProps],
        ['vl-bound', onBound],
        ['vl-plain', onPlain],
        ['vl-items', onItems],
        ['vl-ref', onRef],
        ['vl-read-ref', onReadRef],
        ['reset', reset],
    ];
    onMount(() => listeners.forEach(([name, fn]) => document.addEventListener(name, fn)));
    onCleanup(() => listeners.forEach(([name, fn]) => document.removeEventListener(name, fn)));

    return (
        <Show when={mounted()}>
            <div class={selectors.keyed}>
                <VirtualList
                    each={store.items}
                    startIndex={start()}
                    pageSize={page()}
                    ref={(r) => (refs.keyed = r)}
                    fallback={<div class={selectors.fallback}>Empty</div>}
                >
                    {(item, index) => <Row item={item} index={index()} />}
                </VirtualList>
            </div>
            <div class={selectors.unkeyed}>
                <VirtualList
                    keyed={false}
                    each={store.items}
                    startIndex={start()}
                    pageSize={page()}
                    ref={(r) => (refs.unkeyed = r)}
                >
                    {(item, index) => <Row item={item()} index={index} />}
                </VirtualList>
            </div>
            <div class={selectors.defaults}>
                <VirtualList each={store.items}>{(item, index) => <Row item={item} index={index()} />}</VirtualList>
            </div>
            <div class={selectors.bound} data-start={boundStart()} data-page={boundPage()}>
                <VirtualList
                    each={store.items}
                    startIndex={boundStart()}
                    pageSize={boundPage()}
                    onStartIndexChange={setBoundStart}
                    onPageSizeChange={setBoundPage}
                    ref={(r) => (refs.bound = r)}
                >
                    {(item, index) => <Row item={item} index={index()} />}
                </VirtualList>
            </div>
            <div class={selectors.plain} data-recomputes={recomputes()}>
                <VirtualList keyed={false} each={plain()} startIndex={0} pageSize={PLAIN_ITEMS.length}>
                    {(item, index) => {
                        // Counts how often a row's item is recomputed
                        const value = createMemo(() => {
                            setRecomputes((n) => n + 1);
                            return item();
                        });
                        return <div class={selectors.row} data-index={index}>{value()}</div>;
                    }}
                </VirtualList>
            </div>
        </Show>
    );
};

export default VirtualListTest;
