import {
    Accessor,
    createComponent,
    createEffect,
    createMemo,
    createRenderEffect,
    createSelector,
    createSignal,
    For,
    Index,
    JSX,
    on,
    onCleanup,
    onMount,
    Show,
    splitProps,
    untrack,
    useContext,
} from 'solid-js';
// @ts-ignore
import { spatialNavigation } from 'coherent-gameface-interaction-manager';
import Scroll, { OnScrollHandler, ScrollComponentRef, ScrollContext } from '../Scroll/Scroll';
import { ComponentBaseProps } from '@components/types/ComponentProps';
import { useNavigation } from '@components/Utility/Navigation/Navigation';
import { waitForFrames } from '@components/utils/waitForFrames';
import { createVirtualization, getVirtualizationInternals, resolveItems, VirtualEngine } from './createVirtualization';
import {
    computeLayout,
    computeStartRow,
    computeVisibleRange,
    itemX,
    itemY,
    layoutEquals,
    ResolvedSizes,
    rowForSlot,
    scrollTopForIndex,
    VirtualLayout,
} from './layout';
import {
    VirtualDirection,
    Virtualization,
    VirtualizationOptions,
    VirtualLength,
    VirtualRenderFunction,
    VirtualScrollAlign,
} from './types';
import styles from './VirtualScroll.module.scss';
import isString from '@components/utils/isString';

export * from './types';
export { createVirtualization } from './createVirtualization';

type ShorthandOptions<T> = Partial<Omit<VirtualizationOptions<T>, 'items' | 'component'>>;

export interface VirtualScrollProps<T> extends Omit<ComponentBaseProps, 'children'>, ShorthandOptions<T> {
    /** Created with createVirtualization. When set, the shorthand props are ignored. */
    virtualization?: Virtualization<T>;
    /** Shorthand: data to render */
    items?: T[];
    /** Shorthand: renders one item. Both arguments are accessors. */
    children?: VirtualRenderFunction<T>;
    /** Navigation area name - enables keyboard / gamepad navigation */
    navigation?: string;
    /** Rendered when there are no items */
    fallback?: JSX.Element;
    minHandleSize?: number;
    onScroll?: OnScrollHandler;
    ref?: ScrollComponentRef;
}

/** Handlers the inner list provides to the outer Scroll */
interface ListController {
    focusIn?: (e: FocusEvent) => void;
    move?: (direction: VirtualDirection) => void;
}

const OPTION_KEYS = [
    'itemHeight', 'itemWidth', 'gap', 'align', 'mode', 'overscan', 'batchSize', 'stickToEnd',
    'onEndReached', 'endThreshold', 'onRangeChange', 'onNavigationEdge',
] as const;

const sizesEqual = (a: ResolvedSizes | null, b: ResolvedSizes | null) =>
    a === b || (!!a && !!b && a.itemHeight === b.itemHeight && a.itemWidth === b.itemWidth &&
        a.gap === b.gap && a.overscanPx === b.overscanPx && a.overscanRows === b.overscanRows);

const MAX_MEASURE_ATTEMPTS = 10;

interface VirtualListProps<T> {
    virtualization: Virtualization<T>;
    navigation?: string;
    fallback?: JSX.Element;
    controller: ListController;
}

function VirtualList<T>(props: VirtualListProps<T>) {
    const ctx = useContext(ScrollContext)!;
    const nav = useNavigation();
    const virtualization = props.virtualization;
    const opts = virtualization.options;
    const internals = getVirtualizationInternals(virtualization);
    const mode = opts.mode ?? 'recycle';
    const align = opts.align ?? 'start';
    const navigationName = props.navigation;
    const hasNavigation = !!(nav && navigationName);

    // Not memoized - store arrays mutated in place keep their identity, reading
    // `.length` / `[i]` through this accessor is what tracks them
    const items = () => resolveItems(opts.items) ?? [];
    const count = () => items().length;
    const scrollTop = () => Math.floor(ctx.scrollTop());

    let listEl!: HTMLDivElement;
    let itemProbe!: HTMLDivElement;
    let extraProbe!: HTMLDivElement;
    let disposed = false;

    // ---- Size resolution -------------------------------------------------

    const needsProbe = [opts.itemHeight, opts.itemWidth, opts.gap, opts.overscan].some(isString);
    const probeValue = (value: VirtualLength | undefined) => (isString(value) ? value : '0px');

    const readSize = (value: VirtualLength | undefined, el: HTMLElement | undefined, dimension: 'width' | 'height') => {
        if (value === undefined) return 0;
        if (!isString(value)) return value;
        return el ? el.getBoundingClientRect()[dimension] : 0;
    };

    const readSizes = (): ResolvedSizes | null => {
        const itemHeight = readSize(opts.itemHeight, itemProbe, 'height');
        if (!(itemHeight > 0)) return null;

        return {
            itemHeight,
            itemWidth: readSize(opts.itemWidth, itemProbe, 'width'),
            gap: readSize(opts.gap, extraProbe, 'width'),
            overscanPx: isString(opts.overscan) ? readSize(opts.overscan, extraProbe, 'height') : null,
            overscanRows: typeof opts.overscan === 'number' ? opts.overscan : null,
        };
    };

    // Pixel-only sizes are known up front, CSS lengths need a laid out probe
    const [sizes, setSizes] = createSignal<ResolvedSizes | null>(needsProbe ? null : readSizes(), { equals: sizesEqual });

    const measure = (attempt = 0) => {
        if (disposed) return;
        const resolved = readSizes();
        if (resolved) return setSizes(resolved);
        if (attempt < MAX_MEASURE_ATTEMPTS) waitForFrames(() => measure(attempt + 1), 1);
    };

    // Gameface applies layout a couple of frames after a style / viewport change
    const scheduleMeasure = () => needsProbe && waitForFrames(() => measure(), 2);

    // ---- Layout and window -----------------------------------------------

    const layout = createMemo<VirtualLayout | null>(() => {
        const resolved = sizes();
        if (!resolved) return null;
        return computeLayout(resolved, ctx.contentWidth(), ctx.viewportHeight(), count(), align);
    }, null, { equals: (a, b) => a === b || (!!a && !!b && layoutEquals(a, b)) });

    const startRow = createMemo(() => {
        const l = layout();
        return l ? computeStartRow(l, scrollTop()) : 0;
    });

    // Append mode: rows created so far
    const [loadedRows, setLoadedRows] = createSignal(0);

    const renderedRange = createMemo(() => {
        const l = layout();
        if (!l) return { start: 0, end: 0 };
        if (mode === 'append') return { start: 0, end: Math.min(count(), loadedRows() * l.columns) };

        const start = startRow() * l.columns;
        return { start, end: Math.min(count(), (startRow() + l.poolRows) * l.columns) };
    }, undefined, { equals: (a, b) => a.start === b.start && a.end === b.end });

    // ---- Append mode -----------------------------------------------------

    if (mode === 'append') {
        const batchSize = Math.max(1, opts.batchSize ?? 5);
        createRenderEffect(() => {
            const l = layout();
            if (!l) return;
            const needed = Math.min(l.rowCount, Math.ceil((scrollTop() + ctx.viewportHeight()) / l.pitch) + l.overscanRows);
            const loaded = untrack(loadedRows);
            if (needed <= loaded) return;

            let next = loaded;
            while (next < needed) next += batchSize;
            setLoadedRows(Math.min(l.rowCount, next));
        });
    }

    // ---- Slots -------------------------------------------------------------

    const focusedIndex = virtualization.focusedIndex;
    const isFocused = createSelector(focusedIndex);
    // Element -> index of the item it currently shows, used to resolve focus events
    const indexOfElement = new WeakMap<Element, Accessor<number>>();
    // recycle: slot id -> element. unmount / append: item index -> element.
    const recycleElements: HTMLDivElement[] = [];
    const keyedElements = new Map<number, HTMLDivElement>();

    const renderItem = (item: Accessor<T>, index: Accessor<number>) =>
        createComponent(opts.component, {
            get item() { return item(); },
            get index() { return index(); },
            get focused() { return isFocused(index()); },
        });

    /**
     * Writes position / size straight to the element (no style object diffing) and
     * only when the value changed. Moving is transform-only - no layout solve.
     */
    const bindSlotGeometry = (el: HTMLDivElement, index: Accessor<number>) => {
        let lastX = NaN, lastY = NaN, lastW = NaN, lastH = NaN;

        createRenderEffect(() => {
            const l = layout();
            if (!l) return;

            if (l.cellHeight !== lastH) el.style.height = `${(lastH = l.cellHeight)}px`;
            if (l.isGrid && l.cellWidth !== lastW) el.style.width = `${(lastW = l.cellWidth)}px`;

            const i = index();
            const x = l.isGrid ? itemX(l, i) : 0;
            const y = itemY(l, i);
            if (x !== lastX || y !== lastY) {
                lastX = x;
                lastY = y;
                el.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
    };

    const slotClass = () => `${styles.slot} ${layout()?.isGrid ? '' : styles.slotFull}`;

    const RecycleSlot = (slotProps: { id: number }) => {
        const index = createMemo(() => {
            const l = layout()!;
            const slotRow = Math.floor(slotProps.id / l.columns);
            return rowForSlot(slotRow, startRow(), l.poolRows) * l.columns + (slotProps.id % l.columns);
        });
        const active = createMemo(() => index() < count());
        // The item component is created the first time the slot is used and then kept -
        // a slot past the end of the data keeps its last item, hidden
        const used = createMemo<boolean>((prev) => prev || active(), false);
        const item = createMemo<T>((prev) => (active() ? items()[index()] : prev) as T);

        const el = (
            <div class={slotClass()}>
                <Show when={used()}>{renderItem(item, index)}</Show>
            </div>
        ) as HTMLDivElement;

        if (hasNavigation) el.setAttribute('tabindex', '1');
        indexOfElement.set(el, index);
        recycleElements[slotProps.id] = el;
        onCleanup(() => {
            if (recycleElements[slotProps.id] === el) delete recycleElements[slotProps.id];
        });

        bindSlotGeometry(el, index);
        createRenderEffect(() => {
            const isActive = active();
            el.style.visibility = isActive ? '' : 'hidden';
            if (isActive) el.removeAttribute('disabled');
            else el.setAttribute('disabled', '');
        });

        return el;
    };

    const KeyedSlot = (slotProps: { item: T; index: Accessor<number> }) => {
        const index = slotProps.index;
        const el = (
            <div class={slotClass()}>{renderItem(() => slotProps.item, index)}</div>
        ) as HTMLDivElement;

        if (hasNavigation) el.setAttribute('tabindex', '1');
        indexOfElement.set(el, index);

        let registered = -1;
        createRenderEffect(() => {
            const i = index();
            if (keyedElements.get(registered) === el) keyedElements.delete(registered);
            keyedElements.set((registered = i), el);
        });
        onCleanup(() => {
            if (keyedElements.get(registered) === el) keyedElements.delete(registered);
        });

        bindSlotGeometry(el, index);
        return el;
    };

    const slotIds = createMemo(() => {
        const l = layout();
        const total = l ? l.poolRows * l.columns : 0;
        return Array.from({ length: total }, (_, i) => i);
    }, [], { equals: (a, b) => a.length === b.length });

    const keyedItems = createMemo(() => {
        const range = renderedRange();
        return items().slice(range.start, range.end);
    });

    const getElementForIndex = (index: number): HTMLDivElement | undefined => {
        if (mode !== 'recycle') return keyedElements.get(index);

        const l = layout();
        if (!l || !l.poolRows) return undefined;
        const slotId = (Math.floor(index / l.columns) % l.poolRows) * l.columns + (index % l.columns);
        const el = recycleElements[slotId];
        return el && indexOfElement.get(el)?.() === index ? el : undefined;
    };

    const indexOfTarget = (target: EventTarget | null) => {
        let el = target as Element | null;
        while (el && el !== listEl) {
            const index = indexOfElement.get(el);
            if (index) return index();
            el = el.parentElement;
        }
        return -1;
    };

    // ---- Scrolling ---------------------------------------------------------

    const clampIndex = (index: number) => Math.max(0, Math.min(count() - 1, Math.floor(index)));

    const scrollToIndex = (index: number, alignTo: VirtualScrollAlign) => {
        const l = layout();
        if (!l || !count()) return;
        const target = scrollTopForIndex(l, clampIndex(index), alignTo, scrollTop(), ctx.viewportHeight());
        if (target !== null && target !== scrollTop()) ctx.scrollToPosition(target);
    };

    /** Scrolls now and once more after layout - the DOM clamps to the old height when the spacer just grew */
    const scrollToPositionSettled = (value: number) => {
        ctx.scrollToPosition(value);
        waitForFrames(() => !disposed && ctx.scrollToPosition(value), 1);
    };

    // ---- Focus and navigation ----------------------------------------------

    let navigating = false;
    let pausedNavigation = false;

    const focusIndex = (index: number) => {
        if (!count()) return;
        const target = clampIndex(index);

        navigating = true;
        scrollToIndex(target, 'nearest');
        navigating = false;

        const el = getElementForIndex(target);
        if (!el) return;
        el.focus();
        internals.setFocusedIndex(target);
    };

    const move = (direction: VirtualDirection) => {
        const current = untrack(focusedIndex);
        const l = layout();
        if (current < 0 || !l) return;

        const columns = l.columns;
        const column = current % columns;
        let next = -1;

        switch (direction) {
            case 'left': if (column > 0) next = current - 1; break;
            case 'right': if (column < columns - 1 && current + 1 < count()) next = current + 1; break;
            case 'up': if (current - columns >= 0) next = current - columns; break;
            case 'down':
                if (Math.floor(current / columns) + 1 < l.rowCount) next = Math.min(current + columns, count() - 1);
                break;
        }

        if (next >= 0) focusIndex(next);
        else opts.onNavigationEdge?.(direction);
    };

    const onFocusIn = (e: FocusEvent) => {
        const index = indexOfTarget(e.target);
        if (index < 0) return;

        internals.setFocusedIndex(index);
        scrollToIndex(index, 'nearest');

        // The list moves focus by index while it owns focus - spatial navigation would
        // wrap to the opposite edge of the rendered slots at the window's end
        if (hasNavigation && spatialNavigation.enabled && !spatialNavigation.paused) {
            nav!.pauseNavigation();
            pausedNavigation = true;
        }
    };

    const onFocusOut = () => {
        queueMicrotask(() => {
            if (disposed || listEl.contains(document.activeElement)) return;
            internals.setFocusedIndex(-1);
            if (pausedNavigation) {
                pausedNavigation = false;
                if (spatialNavigation.paused) nav!.resumeNavigation();
            }
        });
    };

    props.controller.focusIn = onFocusIn;
    props.controller.move = move;

    // Focus follows the item: when the focused item leaves the rendered window
    // (wheel / stick scrolling), focus the nearest visible item instead
    createEffect(on(renderedRange, () => {
        const current = untrack(focusedIndex);
        if (navigating || current < 0) return;

        const el = getElementForIndex(current);
        if (el && document.activeElement === el) return;

        const l = layout();
        if (!l || !count()) return;
        const visible = computeVisibleRange(l, scrollTop(), ctx.viewportHeight(), count());
        const target = Math.max(visible.start, Math.min(current, visible.end - 1));
        const targetEl = getElementForIndex(target);
        if (!targetEl) return;
        targetEl.focus();
        internals.setFocusedIndex(target);
    }, { defer: true }));

    // ---- Navigation area ---------------------------------------------------

    let areaState: 'none' | 'pending' | 'ready' = 'none';
    let areaDirty = false;
    let areaRefreshQueued = false;

    const navigableElements = () =>
        mode === 'recycle' ? recycleElements.filter(Boolean) : Array.from(keyedElements.values());

    const refreshArea = () => {
        if (!hasNavigation || disposed) return;
        const elements = navigableElements();

        if (areaState === 'none') {
            if (!elements.length) return;
            // Goes through Navigation so focusFirst / switchArea know the area
            areaState = 'pending';
            nav!.registerArea(navigationName!, elements);
            waitForFrames(() => {
                areaState = 'ready';
                if (areaDirty) refreshArea();
            }, 4);
            return;
        }

        if (areaState === 'pending') {
            areaDirty = true;
            return;
        }

        areaDirty = false;
        if (!spatialNavigation.enabled) return;
        if (spatialNavigation.areas[navigationName!]) spatialNavigation.remove(navigationName);
        if (elements.length) spatialNavigation.add([{ area: navigationName, elements }]);
        // remove() strips tabindex - the slots must stay focusable for focusIndex
        elements.forEach((el) => el.setAttribute('tabindex', '1'));
    };

    const queueAreaRefresh = () => {
        if (!hasNavigation || areaRefreshQueued) return;
        areaRefreshQueued = true;
        requestAnimationFrame(() => {
            areaRefreshQueued = false;
            refreshArea();
        });
    };

    if (hasNavigation) {
        // recycle: elements change only with the pool size. unmount / append: on every window change.
        const elementsChanged: Accessor<unknown> = mode === 'recycle' ? slotIds : keyedItems;
        createEffect(on(elementsChanged, queueAreaRefresh));
    }

    // ---- Responsiveness: keep the user's place when the grid reflows ---------

    let previousLayout: VirtualLayout | null = null;
    createEffect(() => {
        const l = layout();
        if (!l) return;
        const prev = previousLayout;
        previousLayout = l;
        if (!prev || (prev.columns === l.columns && prev.pitch === l.pitch)) return;

        const top = untrack(scrollTop);
        if (top <= 0) return;

        const focused = untrack(focusedIndex);
        const anchor = focused >= 0 ? focused : Math.floor(top / prev.pitch) * prev.columns;
        const offset = (top - itemY(prev, anchor)) * (l.pitch / prev.pitch);
        scrollToPositionSettled(Math.max(0, Math.round(itemY(l, anchor) + offset)));
    });

    // ---- Data changes ------------------------------------------------------

    let wasAtEnd = true;
    let sticking = false;

    if (opts.stickToEnd) {
        // Created before the tracker below so it sees the position from before the change
        createEffect(on(count, () => {
            if (!wasAtEnd) return;
            const l = layout();
            if (!l) return;
            sticking = true;
            scrollToPositionSettled(Math.max(0, l.totalHeight - ctx.viewportHeight()));
            waitForFrames(() => (sticking = false), 2);
        }, { defer: true }));

        createEffect(() => {
            const l = layout();
            if (!l || sticking) return;
            wasAtEnd = scrollTop() >= l.totalHeight - ctx.viewportHeight() - 1;
        });
    }

    if (opts.onEndReached) {
        let fired = false;
        createEffect(on(count, () => (fired = false), { defer: true }));
        createEffect(() => {
            const l = layout();
            if (!l || !l.rowCount) return;
            const lastVisibleRow = Math.floor((scrollTop() + ctx.viewportHeight()) / l.pitch);
            if (lastVisibleRow < l.rowCount - (opts.endThreshold ?? 2)) return;
            if (fired) return;
            fired = true;
            untrack(() => opts.onEndReached!());
        });
    }

    // ---- Public state ------------------------------------------------------

    createEffect(() => {
        const l = layout();
        if (!l) return;
        internals.setColumns(l.columns);
        internals.setVisibleRange(computeVisibleRange(l, scrollTop(), ctx.viewportHeight(), count()));
    });

    createEffect(on(renderedRange, (range) => {
        internals.setRenderedRange(range);
        opts.onRangeChange?.(range);
    }));

    const engine: VirtualEngine = {
        scrollToIndex,
        scrollToOffset: (offset) => ctx.scrollToPosition(Math.max(0, Math.round(offset))),
        focusIndex,
        remeasure: () => {
            ctx.updateMeasurements();
            if (needsProbe) measure();
        },
    };

    let attached = false;
    createEffect(() => {
        if (attached || !layout() || !ctx.viewportHeight()) return;
        attached = true;
        internals.attach(engine);
    });

    // ---- Lifecycle -----------------------------------------------------------

    onMount(() => {
        listEl.addEventListener('focusout', onFocusOut);
        window.addEventListener('resize', scheduleMeasure);
        if (needsProbe) scheduleMeasure();
    });

    onCleanup(() => {
        disposed = true;
        internals.detach(engine);
        listEl.removeEventListener('focusout', onFocusOut);
        window.removeEventListener('resize', scheduleMeasure);
        if (pausedNavigation && spatialNavigation.paused) nav!.resumeNavigation();
        if (hasNavigation && areaState !== 'none' && spatialNavigation.areas?.[navigationName!]) {
            nav!.unregisterArea(navigationName!);
        }
    });

    return (
        <>
            <div ref={listEl} class={styles.list} style={{ height: `${layout()?.totalHeight ?? 0}px` }}>
                <Show when={needsProbe}>
                    <div
                        ref={itemProbe}
                        class={styles.probe}
                        style={{ width: probeValue(opts.itemWidth), height: probeValue(opts.itemHeight) }}
                    />
                    <div
                        ref={extraProbe}
                        class={styles.probe}
                        style={{ width: probeValue(opts.gap), height: probeValue(opts.overscan) }}
                    />
                </Show>
                <div class={styles.window}>
                    {mode === 'recycle'
                        ? <Index each={slotIds()}>{(id) => <RecycleSlot id={id()} />}</Index>
                        : <For each={keyedItems()}>
                            {(item, i) => <KeyedSlot item={item} index={() => renderedRange().start + i()} />}
                        </For>}
                </div>
            </div>
            <Show when={count() === 0 && props.fallback}>{props.fallback}</Show>
        </>
    );
}

function VirtualScroll<T>(props: VirtualScrollProps<T>) {
    const [local, options, scrollProps] = splitProps(
        props,
        ['virtualization', 'items', 'children', 'navigation', 'fallback'],
        OPTION_KEYS,
    );

    // Shorthand: options are read once, `items` stays reactive
    const virtualization = local.virtualization ?? createVirtualization<T>({
        ...options,
        itemHeight: options.itemHeight ?? 0,
        items: () => local.items ?? [],
        component: (itemProps) => local.children!(() => itemProps.item, () => itemProps.index),
    });

    const controller: ListController = {};
    const moveTo = (direction: VirtualDirection) => () => controller.move?.(direction);
    const navigationActions = local.navigation
        ? { 'move-up': moveTo('up'), 'move-down': moveTo('down'), 'move-left': moveTo('left'), 'move-right': moveTo('right') }
        : undefined;

    return (
        <Scroll
            {...scrollProps}
            // Replaces Scroll's scrollIntoView - it uses offsetTop, which is 0 for transformed slots
            focusin={(e: FocusEvent) => controller.focusIn?.(e)}
            onAction={navigationActions ? { ...navigationActions, ...scrollProps.onAction } : scrollProps.onAction}
        >
            <Scroll.Content>
                <VirtualList
                    virtualization={virtualization}
                    navigation={local.navigation}
                    fallback={local.fallback}
                    controller={controller}
                />
            </Scroll.Content>
            <Scroll.Bar>
                <Scroll.Handle />
            </Scroll.Bar>
        </Scroll>
    );
}

export default VirtualScroll;
