import { createSignal, Setter } from 'solid-js';
import { rangeEquals } from './layout';
import { Virtualization, VirtualizationOptions, VirtualRange, VirtualScrollAlign } from './types';

/** Implemented by the mounted VirtualScroll */
export interface VirtualEngine {
    scrollToIndex: (index: number, align: VirtualScrollAlign) => void;
    scrollToOffset: (offset: number) => void;
    focusIndex: (index: number) => void;
    remeasure: () => void;
}

export interface VirtualizationInternals {
    setVisibleRange: Setter<VirtualRange>;
    setRenderedRange: Setter<VirtualRange>;
    setFocusedIndex: Setter<number>;
    setColumns: Setter<number>;
    attach: (engine: VirtualEngine) => void;
    detach: (engine: VirtualEngine) => void;
}

const internals = new WeakMap<Virtualization<any>, VirtualizationInternals>();

export function getVirtualizationInternals<T>(virtualization: Virtualization<T>) {
    const value = internals.get(virtualization);
    if (!value) throw new Error('VirtualScroll: `virtualization` must be created with createVirtualization');
    return value;
}

export const resolveItems = <T,>(items: VirtualizationOptions<T>['items']) =>
    typeof items === 'function' ? items() : items;

/**
 * Creates the state of a virtual list or grid. Pass the result to
 * `<VirtualScroll virtualization={...} />`. The methods can be called before the
 * list is mounted - the last scroll / focus request is applied once it is measured.
 */
export function createVirtualization<T>(options: VirtualizationOptions<T>): Virtualization<T> {
    const [visibleRange, setVisibleRange] = createSignal<VirtualRange>({ start: 0, end: 0 }, { equals: rangeEquals });
    const [renderedRange, setRenderedRange] = createSignal<VirtualRange>({ start: 0, end: 0 }, { equals: rangeEquals });
    const [focusedIndex, setFocusedIndex] = createSignal(-1);
    const [columns, setColumns] = createSignal(1);

    let engine: VirtualEngine | null = null;
    let pending: ((engine: VirtualEngine) => void) | null = null;

    const run = (action: (engine: VirtualEngine) => void) => {
        if (engine) action(engine);
        else pending = action;
    };

    const virtualization: Virtualization<T> = {
        options,
        scrollToIndex: (index, align = 'nearest') => run((e) => e.scrollToIndex(index, align)),
        scrollToOffset: (offset) => run((e) => e.scrollToOffset(offset)),
        scrollToItem: (predicate, align = 'nearest') => {
            const index = resolveItems(options.items).findIndex(predicate);
            if (index !== -1) virtualization.scrollToIndex(index, align);
        },
        focusIndex: (index) => run((e) => e.focusIndex(index)),
        visibleRange,
        renderedRange,
        focusedIndex,
        columns,
        remeasure: () => engine?.remeasure(),
    };

    internals.set(virtualization, {
        setVisibleRange,
        setRenderedRange,
        setFocusedIndex,
        setColumns,
        attach: (value) => {
            engine = value;
            if (pending) {
                const action = pending;
                pending = null;
                action(value);
            }
        },
        detach: (value) => {
            if (engine === value) engine = null;
        },
    });

    return virtualization;
}
