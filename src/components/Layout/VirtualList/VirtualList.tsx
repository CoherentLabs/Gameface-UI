import { Accessor, createComputed, createMemo, createRenderEffect, createSignal, For, JSX, on, Show, untrack } from 'solid-js';

/** Attribute set on each row's root element, with the row's absolute index. */
export const VIRTUAL_LIST_INDEX_ATTR = 'data-vl-index';

export interface VirtualListRef {
    /** First item rendered. Setting it re-renders the slice at once. */
    startIndex: number;
    /** Most items rendered. Setting it re-renders the slice at once. */
    pageSize: number;
    /** Length of the full list. */
    readonly length: number;
    /** startIndex += pageSize, if that is still inside the list. */
    nextPage(): void;
    /** startIndex -= pageSize, not below 0. */
    prevPage(): void;
}

interface VirtualListBaseProps<T> {
    /** The full list. */
    each: readonly T[] | undefined | null | false;
    /** First item rendered. Truncated to an integer, not below 0. Default 0. */
    startIndex?: number;
    /** Most items rendered. Truncated to an integer, not below 0. Default 0, which renders nothing (as native). */
    pageSize?: number;
    /** Rendered when `each` is empty. */
    fallback?: JSX.Element;
    /** Called with the ref when the list is created. */
    ref?: VirtualListRef | ((ref: VirtualListRef) => void);
}

export interface VirtualListKeyedProps<T> extends VirtualListBaseProps<T> {
    /**
     * true (default): rows follow items by reference, like `<For>`. With a store updated by
     * `reconcile(items, { key })` that means by ID field.
     */
    keyed?: true;
    /** The template. `index` is the item's absolute index in `each`. */
    children: (item: T, index: Accessor<number>) => JSX.Element;
}

export interface VirtualListUnkeyedProps<T> extends VirtualListBaseProps<T> {
    /** false: rows follow absolute positions, like `<Index>` and like the native virtual list. */
    keyed: false;
    /** The template. `item` updates in place; `index` is the row's absolute index in `each`. */
    children: (item: Accessor<T>, index: number) => JSX.Element;
}

export type VirtualListProps<T> = VirtualListKeyedProps<T> | VirtualListUnkeyedProps<T>;

/** Integer, not below 0. NaN and undefined become 0. */
const toCount = (value: number | undefined) => {
    const n = Math.trunc(Number(value));
    return n > 0 ? n : 0;
};

/** Sets the row marker when the row's root is a single element. */
const markRow = (node: JSX.Element, index: () => number) => {
    if (node && typeof (node as Element).setAttribute === 'function') {
        createRenderEffect(() => (node as Element).setAttribute(VIRTUAL_LIST_INDEX_ATTR, String(index())));
    }
    return node;
};

/**
 * Renders a slice of a list: `pageSize` items starting at `startIndex`.
 * The Solid counterpart of the native `engine.createVirtualList()`, for lists whose rows
 * need Solid reactivity, interactions or components. It renders no element of its own:
 * the rows go straight into the parent.
 */
function VirtualList<T>(props: VirtualListProps<T>): JSX.Element {
    const [start, setStart] = createSignal(0);
    const [size, setSize] = createSignal(0);

    // Props and ref drive the same state: a prop change overrides a value set through the ref.
    createComputed(on(() => props.startIndex, (value) => setStart(toCount(value))));
    createComputed(on(() => props.pageSize, (value) => setSize(toCount(value))));

    const list = createMemo(() => props.each || ([] as readonly T[]));
    const length = createMemo(() => list().length);

    /** Absolute index of the first row and one past the last row. */
    const end = createMemo(() => Math.min(start() + size(), length()));

    const ref: VirtualListRef = {
        get startIndex() {
            return start();
        },
        set startIndex(value: number) {
            setStart(toCount(value));
        },
        get pageSize() {
            return size();
        },
        set pageSize(value: number) {
            setSize(toCount(value));
        },
        get length() {
            return length();
        },
        nextPage() {
            untrack(() => {
                const next = start() + size();
                if (next < length()) setStart(next);
            });
        },
        prevPage() {
            untrack(() => setStart(Math.max(0, start() - size())));
        },
    };

    (props.ref as ((ref: VirtualListRef) => void) | undefined)?.(ref);

    const keyedRows = () => {
        const p = props as VirtualListKeyedProps<T>;
        const slice = createMemo(() => {
            const from = start();
            const to = end();
            return from < to ? list().slice(from, to) : [];
        });
        return (
            <For each={slice()}>
                {(item, i) => {
                    const index = () => start() + i();
                    return markRow(p.children(item, index), index);
                }}
            </For>
        );
    };

    const unkeyedRows = () => {
        const p = props as VirtualListUnkeyedProps<T>;
        // Rows are keyed by absolute index, so a row stays while its index is in the slice
        // and its item updates in place.
        const indexes = createMemo(() => {
            const result: number[] = [];
            for (let i = start(); i < end(); i++) result.push(i);
            return result;
        });
        return (
            <For each={indexes()}>
                {(index) => markRow(p.children(() => list()[index], index), () => index)}
            </For>
        );
    };

    return (
        <Show when={length() > 0} fallback={props.fallback}>
            {props.keyed === false ? unkeyedRows() : keyedRows()}
        </Show>
    );
}

export default VirtualList;
