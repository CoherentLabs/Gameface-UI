import {
    createContext,
    createEffect,
    createMemo,
    createRenderEffect,
    createSignal,
    JSX,
    on,
    onCleanup,
    onMount,
    ParentComponent,
    Show,
    untrack,
    useContext,
} from 'solid-js';
import Scroll, { ScrollContext } from '@components/Layout/Scroll/Scroll';
import { waitForFrames } from '@components/utils/waitForFrames';
import styles from './VirtualScrollBench.module.scss';

// EXPERIMENT (bench only) - a normal Scroll whose children can have any height, but
// whose off-screen content is taken out of the tree ("content culling", like CSS
// `content-visibility: auto`, which Gameface doesn't support).
//
//  - Every child is wrapped in <LazyScroll.Item>. Items stay in normal flow, so
//    layout handles variable heights - no position math.
//  - An item's content is only created once it comes near the viewport (Solid
//    creates children lazily, so items never scrolled to cost one empty div).
//  - Far away again, the item keeps its measured height as an empty box and its
//    content is either hidden (`display: none`, mode "hide" - state kept, instant
//    to show again) or disposed (mode "dispose" - memory freed, recreated later).
//  - Items never shown use an estimated height until they are measured; when a
//    measured item above the viewport changes height, the scroll is corrected so
//    the visible content doesn't jump.
//
// The question it answers: does Gameface skip `display: none` subtrees in its
// per-frame work (mode "hide"), and how close does culling get to recycling?

export type LazyMode = 'hide' | 'dispose';

interface ItemState {
    el: HTMLDivElement;
    /** Top relative to the LazyScroll content, cached - never read from the DOM while scrolling */
    top: number;
    /** Measured height, or the estimate until measured */
    height: number;
    near: boolean;
    setNear: (near: boolean) => void;
    /** Update generation in which the item was last found near the viewport */
    generation: number;
}

interface LazyContextValue {
    mode: LazyMode;
    estimatedHeight: number;
    register: (state: ItemState) => void;
    unregister: (state: ItemState) => void;
    observe: (state: ItemState) => void;
    unobserve: (state: ItemState) => void;
}

const LazyContext = createContext<LazyContextValue>();

export interface LazyScrollApi {
    /** Scrolls like VirtualScroll's scrollToOffset - updates the handle and the culling immediately */
    scrollTo: (offset: number) => void;
}

interface LazyScrollProps {
    mode?: LazyMode;
    /** Extra area kept rendered above and below the viewport, in px. Default: half the viewport. */
    overscan?: number;
    /** Height used for items that were never shown. Default 40. */
    estimatedHeight?: number;
    class?: string;
    style?: JSX.CSSProperties;
    api?: (api: LazyScrollApi) => void;
    children?: JSX.Element;
}

const LazyRoot: ParentComponent<LazyScrollProps> = (props) => {
    const ctx = useContext(ScrollContext)!;
    const items = new Set<ItemState>();
    // Items sorted by cached top - culling is a binary search + a short scan
    let sorted: ItemState[] = [];
    let near: ItemState[] = [];
    let maxHeight = 0;
    let generation = 0;
    let rootEl!: HTMLDivElement;
    let layoutQueued = false;
    let laidOut = false;
    let layoutAttempts = 0;
    let disposed = false;

    // Full re-read of every item's position. Only after items are added / removed or the
    // width changes - never while scrolling (measured height changes are applied as deltas).
    const readLayout = () => {
        if (disposed) return;
        const rootRect = rootEl.getBoundingClientRect();
        // Not laid out yet (every item would read as top 0 and count as visible) - try again
        if (!rootRect.height && items.size && layoutAttempts++ < 120) return queueLayout();
        laidOut = true;
        const rootTop = rootRect.top;
        maxHeight = 0;
        sorted = Array.from(items);
        for (const state of sorted) {
            const rect = state.el.getBoundingClientRect();
            state.top = rect.top - rootTop;
            if (rect.height > 0) state.height = rect.height;
            if (state.height > maxHeight) maxHeight = state.height;
        }
        sorted.sort((a, b) => a.top - b.top);
        update();
    };

    // Gameface applies layout a couple of frames after a change
    const queueLayout = () => {
        if (layoutQueued) return;
        layoutQueued = true;
        waitForFrames(() => {
            layoutQueued = false;
            readLayout();
        }, 2);
    };

    const update = () => {
        if (!laidOut) return;
        const scrollTop = ctx.scrollTop();
        const viewport = ctx.viewportHeight();
        const overscan = props.overscan ?? viewport / 2;
        const from = scrollTop - overscan;
        const to = scrollTop + viewport + overscan;
        generation++;

        // First item that can reach `from` (no item is taller than maxHeight)
        let lo = 0, hi = sorted.length;
        const start = from - maxHeight;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (sorted[mid].top < start) lo = mid + 1;
            else hi = mid;
        }

        const next: ItemState[] = [];
        for (let i = lo; i < sorted.length; i++) {
            const state = sorted[i];
            if (state.top > to) break;
            if (state.top + state.height < from) continue;
            state.generation = generation;
            next.push(state);
            if (!state.near) state.setNear(true);
        }

        for (const state of near) {
            if (state.generation !== generation && state.near) state.setNear(false);
        }
        near = next;
    };

    const byElement = new WeakMap<HTMLDivElement, ItemState>();

    // Measures items while their content is shown
    const resizeObserver = new ResizeObserver((entries) => {
        let anchorDelta = 0;
        const scrollTop = ctx.scrollTop();

        for (const entry of entries) {
            const state = byElement.get(entry.target as HTMLDivElement);
            if (!state || !state.near) continue;
            const height = (entry.target as HTMLDivElement).getBoundingClientRect().height;
            const delta = height - state.height;
            if (!height || Math.abs(delta) < 0.5) continue;

            // Shift everything below by the difference instead of re-reading the DOM.
            // Assumes a list (one item per row); grids use fixed-size cells.
            const oldBottom = state.top + state.height;
            for (const other of sorted) {
                if (other !== state && other.top >= oldBottom - 0.5) other.top += delta;
            }
            state.height = height;
            if (height > maxHeight) maxHeight = height;
            // An item above the viewport changed - keep the visible content where it was
            if (oldBottom <= scrollTop) anchorDelta += delta;
        }

        if (anchorDelta) ctx.scrollToPosition(scrollTop + anchorDelta);
        update();
    });
    const context: LazyContextValue = {
        mode: props.mode ?? 'hide',
        estimatedHeight: props.estimatedHeight ?? 40,
        register: (state) => {
            items.add(state);
            byElement.set(state.el, state);
            queueLayout();
        },
        unregister: (state) => {
            items.delete(state);
            resizeObserver.unobserve(state.el);
            queueLayout();
        },
        observe: (state) => resizeObserver.observe(state.el),
        unobserve: (state) => resizeObserver.unobserve(state.el),
    };

    // Scroll position / viewport changes -> cull
    createEffect(() => {
        ctx.scrollTop();
        ctx.viewportHeight();
        untrack(update);
    });

    // Width changes reflow the content - positions must be read again
    createEffect(on(ctx.contentWidth, queueLayout, { defer: true }));

    props.api?.({ scrollTo: (offset) => ctx.scrollToPosition(Math.max(0, Math.round(offset))) });

    onMount(queueLayout);
    onCleanup(() => {
        disposed = true;
        resizeObserver.disconnect();
    });

    return (
        <div ref={rootEl} class={styles.lazyRoot}>
            <LazyContext.Provider value={context}>{props.children}</LazyContext.Provider>
        </div>
    );
};

interface LazyItemProps {
    class?: string;
    style?: JSX.CSSProperties;
    estimatedHeight?: number;
    /** Make the content fill the item - only for items with a fixed CSS height. With an auto
     *  height item, a 100% content height has nothing to resolve against. */
    fill?: boolean;
}

const LazyItem: ParentComponent<LazyItemProps> = (props) => {
    const root = useContext(LazyContext);
    if (!root) throw new Error('LazyScroll.Item must be used inside LazyScroll');

    const [near, setNear] = createSignal(false);
    // hide: created on first approach, then only hidden. dispose: exists only while near.
    const created = root.mode === 'hide' ? createMemo<boolean>((prev) => prev || near(), false) : near;

    const el = (
        <div class={props.class} style={props.style}>
            <Show when={created()}>
                <div class={props.fill ? styles.lazyContentFill : styles.lazyContent} style={{ display: near() ? undefined : 'none' }}>
                    {props.children}
                </div>
            </Show>
        </div>
    ) as HTMLDivElement;

    const state: ItemState = {
        el,
        top: 0,
        height: props.estimatedHeight ?? root.estimatedHeight,
        near: false,
        setNear: (value) => {
            state.near = value;
            setNear(value);
        },
        generation: 0,
    };

    // Far away: an empty box with the last known height. Near: the content decides.
    createRenderEffect(on(near, (isNear) => {
        if (isNear) {
            el.style.height = '';
            root.observe(state);
        } else {
            root.unobserve(state);
            el.style.height = `${state.height}px`;
        }
    }));

    root.register(state);
    onCleanup(() => root.unregister(state));

    return el;
};

const LazyScrollBase = (props: LazyScrollProps) => (
    <Scroll class={props.class} style={props.style}>
        <Scroll.Content>
            <LazyRoot
                mode={props.mode}
                overscan={props.overscan}
                estimatedHeight={props.estimatedHeight}
                api={props.api}
            >
                {props.children}
            </LazyRoot>
        </Scroll.Content>
        <Scroll.Bar>
            <Scroll.Handle />
        </Scroll.Bar>
    </Scroll>
);

const LazyScroll = Object.assign(LazyScrollBase, { Item: LazyItem });

export default LazyScroll;
