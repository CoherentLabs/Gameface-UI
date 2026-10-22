import { For, Match, Show, Switch, createSignal, onCleanup, onMount } from 'solid-js';
import Scroll, { ScrollComponentRef } from '@components/Layout/Scroll/Scroll';
import VirtualScroll, { createVirtualization, type VirtualItemProps, type VirtualMode } from '@components/Layout/VirtualScroll/VirtualScroll';
import { waitForFrames } from '@components/utils/waitForFrames';
import LazyScroll, { LazyMode, LazyScrollApi } from './LazyScroll';
import styles from './VirtualScrollBench.module.scss';

// A/B bench for VirtualScroll: the same item component, data and scroll motion,
// rendered four ways:
//
//  - recycle: fixed pool of components, reused while scrolling (default mode)
//  - unmount: windowed, components created / disposed per row crossed
//  - append:  rows created in batches and never removed
//  - plain:   no virtualization - Scroll + <For> over every item
//  - simple:  no virtualization - every item absolutely positioned with transform
//             inside a `display: simple` container (no flex layout solve)
//  - lazy-hide / lazy-dispose: EXPERIMENT (./LazyScroll.tsx) - a normal Scroll with
//             any children; content is created near the viewport, and far away it
//             is hidden (display: none) or disposed while the item keeps its height
//
// Layout "chat" has variable-height messages - only plain and the lazy modes can
// render it (VirtualScroll needs a fixed item size).
//
// Each frame the list is scrolled by a fixed number of px (bouncing between the
// top and the bottom), so every mode does identical work per frame regardless
// of its frame rate.
//
// "apply" = scripting time of the scroll step, which includes the synchronous
// reactive updates of the virtual modes. "frame" = time between rAF callbacks,
// which also includes the engine's style/layout/paint work - compare both.

type Mode = VirtualMode | 'plain' | 'simple' | 'lazy-hide' | 'lazy-dispose';
type ListLayout = 'list' | 'grid' | 'chat';

const MODES: Mode[] = ['recycle', 'unmount', 'append', 'plain', 'simple', 'lazy-hide', 'lazy-dispose'];
const CHAT_MODES: Mode[] = ['plain', 'lazy-hide', 'lazy-dispose'];
const modesFor = (layout: ListLayout) => (layout === 'chat' ? CHAT_MODES : MODES);
const MODE_LABELS: Record<Mode, string> = {
    recycle: 'Recycle',
    unmount: 'Unmount',
    append: 'Append',
    plain: 'Plain Scroll + For',
    simple: 'Simple (all items, display: simple)',
    'lazy-hide': 'Lazy (hide far content)',
    'lazy-dispose': 'Lazy (dispose far content)',
};

const COUNT_OPTIONS = [1000, 5000, 20000];
const SPEED_OPTIONS = [10, 40, 160];
const DURATION_OPTIONS = [3, 5, 10];
const ROUND_OPTIONS = [1, 3];
const WARMUP_MS = 1000;

const LIST_ITEM_HEIGHT = 40;
const GRID_ITEM_SIZE = 80;
const GRID_GAP = 8;
const RARITY_COLORS = ['#9aa3b2', '#4cd964', '#3b82f6', '#a855f7', '#f0c75e'];

interface Item {
    id: number;
    name: string;
    level: number;
    count: number;
    rarity: number;
    progress: number;
}

function createItems(count: number): Item[] {
    let seed = 1234567;
    const rand = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
    };

    return Array.from({ length: count }, (_, id) => ({
        id,
        name: `Item ${id}`,
        level: 1 + Math.floor(rand() * 60),
        count: 1 + Math.floor(rand() * 99),
        rarity: Math.floor(rand() * RARITY_COLORS.length),
        progress: Math.floor(rand() * 100),
    }));
}

// Reads everything from props, so it is safe to recycle
const Card = (props: VirtualItemProps<Item>) => (
    <div class={styles.card} style={{ 'border-color': RARITY_COLORS[props.item.rarity] }}>
        <div class={styles.icon} style={{ 'background-color': RARITY_COLORS[props.item.rarity] }} />
        <div class={styles.info}>
            <div class={styles.name}>{props.item.name}</div>
            <div class={styles.meta}>Lv {props.item.level} · x{props.item.count}</div>
            <div class={styles.bar}>
                <div class={styles.barFill} style={{ width: `${props.item.progress}%` }} />
            </div>
        </div>
    </div>
);

// Variable-height content for the "chat" layout - deterministic, 1 to ~6 lines at 640px
const WORDS = ['gg', 'push', 'mid', 'rotate', 'smoke', 'flank', 'nice', 'reload', 'heal', 'enemy', 'spotted', 'left', 'right',
    'objective', 'captured', 'wait', 'for', 'me', 'the', 'team', 'is', 'on', 'B', 'site', 'need', 'ammo', 'drop', 'here'];

const chatText = (item: Item) => {
    const length = 3 + ((item.id * 37 + item.level * 11) % 70);
    let text = '';
    for (let i = 0; i < length; i++) text += (i ? ' ' : '') + WORDS[(item.id * 7 + i * 13) % WORDS.length];
    return text;
};

const Message = (props: { item: Item }) => (
    <div class={styles.message}>
        <span class={styles.author} style={{ color: RARITY_COLORS[props.item.rarity] }}>Player {props.item.level}: </span>
        <span>{chatText(props.item)}</span>
    </div>
);

interface Driver {
    step: (position: number) => void;
    /** Scroll height minus viewport, read once the layout has settled */
    maxScroll: () => number;
}

interface ModeProps {
    items: Item[];
    layout: ListLayout;
    register: (driver: Driver | null) => void;
}

// Scroll root > .scroll container > content wrapper (the element that scrolls)
const scrollingElement = (ref: ScrollComponentRef) =>
    (ref.element!.firstElementChild?.firstElementChild ?? ref.element) as HTMLElement;

const maxScrollOf = (el: HTMLElement) => Math.max(0, el.scrollHeight - el.clientHeight);

const VirtualModeView = (props: ModeProps & { mode: VirtualMode }) => {
    const grid = props.layout === 'grid';
    const virtualization = createVirtualization({
        items: props.items,
        component: Card,
        mode: props.mode,
        itemHeight: grid ? GRID_ITEM_SIZE : LIST_ITEM_HEIGHT,
        itemWidth: grid ? GRID_ITEM_SIZE : undefined,
        gap: grid ? GRID_GAP : 0,
        batchSize: 10,
    });
    let scrollRef!: ScrollComponentRef;

    onMount(() => {
        const el = scrollingElement(scrollRef);
        props.register({
            step: (position) => virtualization.scrollToOffset(position),
            maxScroll: () => maxScrollOf(el),
        });
    });
    onCleanup(() => props.register(null));

    return <VirtualScroll ref={scrollRef} virtualization={virtualization} class={styles.list} />;
};

// Every item in the DOM like plain, but laid out by hand: absolute + transform inside a
// `display: simple` container, so Gameface skips the flex layout solve for the items
const SimpleMode = (props: ModeProps) => {
    let scrollRef!: ScrollComponentRef;
    let listEl!: HTMLDivElement;
    const grid = props.layout === 'grid';
    const size = grid ? GRID_ITEM_SIZE : LIST_ITEM_HEIGHT;
    const pitch = grid ? GRID_ITEM_SIZE + GRID_GAP : LIST_ITEM_HEIGHT;
    const [columns, setColumns] = createSignal(1);
    // Cells are created only once the columns are known, so each cell's first transform is
    // final - the Style TOM runtime hits a Gameface bug when a translate starts with x or y = 0
    // and changes later
    const [ready, setReady] = createSignal(false);

    onMount(() => {
        // Width is only known after layout (which takes a while for this many nodes) -
        // start driving once the columns match the other modes
        const start = (attempt: number) => {
            if (!listEl.clientWidth && attempt < 120) return waitForFrames(() => start(attempt + 1), 1);
            if (grid) setColumns(Math.max(1, Math.floor((listEl.clientWidth + GRID_GAP) / pitch)));
            setReady(true);
            const el = scrollingElement(scrollRef);
            props.register({
                step: (position) => { el.scrollTop = position; },
                maxScroll: () => maxScrollOf(el),
            });
        };
        waitForFrames(() => start(0), 1);
    });
    onCleanup(() => props.register(null));

    return (
        <Scroll ref={scrollRef} class={styles.list}>
            <Scroll.Content>
                <div ref={listEl} class={styles.simpleList} style={{ height: `${Math.ceil(props.items.length / columns()) * pitch}px` }}>
                    <div class={styles.simpleWindow}>
                        <Show when={ready()}>
                        <For each={props.items}>
                            {(item, index) => (
                                <div
                                    class={styles.simpleCell}
                                    style={{
                                        width: grid ? `${size}px` : '100%',
                                        height: `${size}px`,
                                        transform: `translate(${grid ? (index() % columns()) * pitch : 0}px, ${Math.floor(index() / columns()) * pitch}px)`,
                                    }}
                                >
                                    <Card item={item} index={index()} focused={false} />
                                </div>
                            )}
                        </For>
                        </Show>
                    </div>
                </div>
            </Scroll.Content>
            <Scroll.Bar>
                <Scroll.Handle />
            </Scroll.Bar>
        </Scroll>
    );
};

// EXPERIMENT: the same content as plain, every child wrapped in LazyScroll.Item
const LazyModeView = (props: ModeProps & { mode: LazyMode }) => {
    let api!: LazyScrollApi;
    let rootEl!: HTMLDivElement;

    onMount(() => {
        // Item positions are read after layout - start driving once they are known
        waitForFrames(() => {
            const el = scrollingElement({ element: rootEl.firstElementChild as HTMLElement } as ScrollComponentRef);
            props.register({
                step: (position) => api.scrollTo(position),
                maxScroll: () => maxScrollOf(el),
            });
        }, 3);
    });
    onCleanup(() => props.register(null));

    const itemClass = () => (props.layout === 'grid' ? styles.plainCell : props.layout === 'list' ? styles.plainRow : undefined);
    const estimate = props.layout === 'grid' ? GRID_ITEM_SIZE : 40;

    return (
        <div ref={rootEl} class={styles.list}>
            <LazyScroll mode={props.mode} estimatedHeight={estimate} api={(value) => (api = value)} class={styles.list}>
                <div class={props.layout === 'grid' ? styles.plainGrid : styles.plainList}>
                    <For each={props.items}>
                        {(item, index) => (
                            <LazyScroll.Item class={itemClass()} fill={props.layout !== 'chat'}>
                                {props.layout === 'chat'
                                    ? <Message item={item} />
                                    : <Card item={item} index={index()} focused={false} />}
                            </LazyScroll.Item>
                        )}
                    </For>
                </div>
            </LazyScroll>
        </div>
    );
};

const PlainMode = (props: ModeProps) => {
    let scrollRef!: ScrollComponentRef;

    onMount(() => {
        const el = scrollingElement(scrollRef);
        props.register({
            step: (position) => { el.scrollTop = position; },
            maxScroll: () => maxScrollOf(el),
        });
    });
    onCleanup(() => props.register(null));

    return (
        <Scroll ref={scrollRef} class={styles.list}>
            <Scroll.Content>
                <div class={props.layout === 'grid' ? styles.plainGrid : styles.plainList}>
                    <For each={props.items}>
                        {(item, index) => props.layout === 'chat'
                            ? <Message item={item} />
                            : (
                                <div class={props.layout === 'grid' ? styles.plainCell : styles.plainRow}>
                                    <Card item={item} index={index()} focused={false} />
                                </div>
                            )}
                    </For>
                </div>
            </Scroll.Content>
            <Scroll.Bar>
                <Scroll.Handle />
            </Scroll.Bar>
        </Scroll>
    );
};

interface Stats {
    frames: number;
    frameAvg: number;
    frameP95: number;
    frameMax: number;
    fps: number;
    applyAvg: number;
    applyP95: number;
    applyMax: number;
}

interface Result extends Stats {
    mode: Mode;
    mountMs: number;
    warmupMaxFrame: number;
    nodes: number;
}

function percentile(sorted: number[], p: number) {
    if (!sorted.length) return 0;
    return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
}

function summarize(frameTimes: number[], applyTimes: number[]): Stats {
    const f = [...frameTimes].sort((a, b) => a - b);
    const a = [...applyTimes].sort((a, b) => a - b);
    const sum = (arr: number[]) => arr.reduce((acc, v) => acc + v, 0);
    const frameAvg = f.length ? sum(f) / f.length : 0;

    return {
        frames: f.length,
        frameAvg,
        frameP95: percentile(f, 0.95),
        frameMax: f.length ? f[f.length - 1] : 0,
        fps: frameAvg ? 1000 / frameAvg : 0,
        applyAvg: a.length ? sum(a) / a.length : 0,
        applyP95: percentile(a, 0.95),
        applyMax: a.length ? a[a.length - 1] : 0,
    };
}

const average = (values: number[]) => (values.length ? values.reduce((a, v) => a + v, 0) / values.length : 0);

const fmt = (v: number, digits = 2) => v.toFixed(digits);

function relative(value: number, base: number) {
    if (!base) return '';
    const pct = ((value - base) / base) * 100;
    if (Math.abs(pct) < 0.5) return '±0%';
    return `${pct > 0 ? '+' : ''}${pct.toFixed(0)}%`;
}

const OptionRow = <V extends string | number>(props: {
    label: string;
    options: V[];
    value: V;
    suffix?: string;
    disabled?: boolean;
    onSelect: (v: V) => void;
}) => (
    <div class={styles.row}>
        <div class={styles.rowLabel}>{props.label}</div>
        <For each={props.options}>
            {(option) => (
                <div
                    class={styles.btn}
                    classList={{ [styles.btnActive]: props.value === option, [styles.btnDisabled]: props.disabled }}
                    onClick={() => !props.disabled && props.onSelect(option)}
                >
                    {option}{props.suffix ?? ''}
                </div>
            )}
        </For>
    </div>
);

const VirtualScrollBench = () => {
    const [count, setCount] = createSignal(5000);
    const [listLayout, setListLayout] = createSignal<ListLayout>('grid');
    const [speed, setSpeed] = createSignal(40);
    const [duration, setDuration] = createSignal(5);
    const [rounds, setRounds] = createSignal(1);
    // Recreated on every change so the keyed <Show> fully unmounts the previous mode
    const [active, setActive] = createSignal<{ mode: Mode; items: Item[]; layout: ListLayout } | null>(null);
    const [running, setRunning] = createSignal(false);
    const [status, setStatus] = createSignal('Idle');
    const [live, setLive] = createSignal<Stats | null>(null);
    const [results, setResults] = createSignal<Result[]>([]);

    let stage!: HTMLDivElement;
    let driver: Driver | null = null;
    let position = 0;
    let direction = 1;
    let maxScroll = 0;
    let lastFrameStart = 0;
    let frameTimes: number[] = [];
    let applyTimes: number[] = [];
    let rafId = 0;
    let lastLiveUpdate = 0;
    let itemsCache: { count: number; items: Item[] } | null = null;
    let onFinished: ((results: Result[]) => void) | null = null;

    // Benchmark runner state
    let queue: Mode[] = [];
    let phaseStart = 0;
    let measuring = false;
    let warmupMaxFrame = 0;
    let lastMountMs = 0;
    type Collected = { frames: number[]; applies: number[]; mounts: number[]; warmupMax: number[]; nodes: number[] };
    const emptyCollected = (): Collected => ({ frames: [], applies: [], mounts: [], warmupMax: [], nodes: [] });
    let collected = {} as Record<Mode, Collected>;

    const getItems = () => {
        if (!itemsCache || itemsCache.count !== count()) itemsCache = { count: count(), items: createItems(count()) };
        return itemsCache.items;
    };

    const register = (value: Driver | null) => {
        driver = value;
        position = 0;
        direction = 1;
        maxScroll = 0;
        // Skip the mount frame - its delta would include the whole mount
        lastFrameStart = 0;
    };

    const mount = (mode: Mode) => {
        const items = getItems();
        frameTimes = [];
        applyTimes = [];
        warmupMaxFrame = 0;
        setActive(null);
        const t0 = performance.now();
        setActive({ mode, items, layout: listLayout() });
        lastMountMs = performance.now() - t0;
    };

    const countNodes = () => stage.getElementsByTagName('*').length;

    const startNextQueued = () => {
        const mode = queue.shift();
        if (!mode) return finishRun();
        measuring = false;
        phaseStart = performance.now();
        setStatus(`Warming up: ${MODE_LABELS[mode]}`);
        mount(mode);
        collected[mode].mounts.push(lastMountMs);
    };

    const finishRun = () => {
        setRunning(false);
        setActive(null);
        const out: Result[] = modesFor(listLayout()).map((mode) => ({
            mode,
            ...summarize(collected[mode].frames, collected[mode].applies),
            mountMs: average(collected[mode].mounts),
            warmupMaxFrame: average(collected[mode].warmupMax),
            nodes: average(collected[mode].nodes),
        }));
        setResults(out);
        setStatus('Done');
        onFinished?.(out);
        onFinished = null;
        console.log('[VirtualScrollBench] results', JSON.stringify({
            count: count(), layout: listLayout(), speedPxPerFrame: speed(), durationS: duration(), rounds: rounds(), results: out,
        }, null, 2));
    };

    const runBenchmark = () => {
        if (running()) return;
        collected = Object.fromEntries(MODES.map((mode) => [mode, emptyCollected()])) as Record<Mode, Collected>;
        // Alternate the order each round so slow drift (GC, thermals) doesn't favour one mode
        const modes = modesFor(listLayout());
        queue = [];
        for (let r = 0; r < rounds(); r++) queue.push(...(r % 2 === 0 ? modes : [...modes].reverse()));
        setResults([]);
        setLive(null);
        setRunning(true);
        startNextQueued();
    };

    const startLive = (mode: Mode) => {
        if (running() || !modesFor(listLayout()).includes(mode)) return;
        setStatus(`Live: ${MODE_LABELS[mode]}`);
        mount(mode);
    };

    const stop = () => {
        queue = [];
        setRunning(false);
        setActive(null);
        setLive(null);
        setStatus('Idle');
    };

    const step = () => {
        if (!driver) return 0;
        if (!maxScroll) maxScroll = driver.maxScroll();

        position += direction * speed();
        if (position >= maxScroll) {
            position = maxScroll;
            direction = -1;
            // Append mode grows the scroll height as it loads - re-read at the turn
            maxScroll = driver.maxScroll();
        } else if (position <= 0) {
            position = 0;
            direction = 1;
        }

        const a0 = performance.now();
        driver.step(position);
        return performance.now() - a0;
    };

    const loop = () => {
        rafId = requestAnimationFrame(loop);
        const now = performance.now();
        const delta = lastFrameStart ? now - lastFrameStart : 0;
        lastFrameStart = now;

        const current = active();
        if (!driver || !current) return;

        const applyTime = step();

        if (running()) {
            const elapsed = now - phaseStart;
            if (!measuring) {
                warmupMaxFrame = Math.max(warmupMaxFrame, delta);
                if (elapsed >= WARMUP_MS) {
                    measuring = true;
                    phaseStart = now;
                    collected[current.mode].warmupMax.push(warmupMaxFrame);
                    setStatus(`Measuring: ${MODE_LABELS[current.mode]}`);
                }
                return;
            }
            if (delta) collected[current.mode].frames.push(delta);
            collected[current.mode].applies.push(applyTime);
            if (elapsed >= duration() * 1000) {
                collected[current.mode].nodes.push(countNodes());
                startNextQueued();
            }
            return;
        }

        // Live mode: rolling window, refreshed once a second
        if (delta) frameTimes.push(delta);
        applyTimes.push(applyTime);
        if (frameTimes.length > 240) frameTimes.shift();
        if (applyTimes.length > 240) applyTimes.shift();
        if (now - lastLiveUpdate > 1000) {
            lastLiveUpdate = now;
            setLive(summarize(frameTimes, applyTimes));
        }
    };

    // Automation hook: `await __virtualScrollBench.run({ count: 5000, layout: 'grid' })`
    const automation = {
        live: (mode: Mode) => startLive(mode),
        configure: (config: Partial<{ count: number; layout: ListLayout; speed: number }>) => {
            if (config.count) setCount(config.count);
            if (config.layout) setListLayout(config.layout);
            if (config.speed) setSpeed(config.speed);
        },
        stop,
        run: (config: Partial<{ count: number; layout: ListLayout; speed: number; duration: number; rounds: number }> = {}) =>
            new Promise<Result[]>((resolve) => {
                if (config.count) setCount(config.count);
                if (config.layout) setListLayout(config.layout);
                if (config.speed) setSpeed(config.speed);
                if (config.duration) setDuration(config.duration);
                if (config.rounds) setRounds(config.rounds);
                onFinished = resolve;
                runBenchmark();
            }),
    };

    onMount(() => {
        (window as any).__virtualScrollBench = automation;
        rafId = requestAnimationFrame(loop);
    });
    onCleanup(() => {
        cancelAnimationFrame(rafId);
        delete (window as any).__virtualScrollBench;
    });

    // Recycle when it ran, plain for the chat layout
    const baseline = () => results().find((r) => r.mode === 'recycle') ?? results().find((r) => r.mode === 'plain');

    return (
        <div class={styles.bench}>
            <div ref={stage} class={styles.stage}>
                <Show when={active()} keyed>
                    {(current) => (
                        <Switch>
                            <Match when={current.mode === 'simple'}>
                                <SimpleMode items={current.items} layout={current.layout} register={register} />
                            </Match>
                            <Match when={current.mode === 'plain'}>
                                <PlainMode items={current.items} layout={current.layout} register={register} />
                            </Match>
                            <Match when={current.mode === 'lazy-hide' || current.mode === 'lazy-dispose'}>
                                <LazyModeView
                                    mode={current.mode === 'lazy-hide' ? 'hide' : 'dispose'}
                                    items={current.items}
                                    layout={current.layout}
                                    register={register}
                                />
                            </Match>
                            <Match when={current.mode === 'recycle' || current.mode === 'unmount' || current.mode === 'append'}>
                                <VirtualModeView
                                    mode={current.mode as VirtualMode}
                                    items={current.items}
                                    layout={current.layout}
                                    register={register}
                                />
                            </Match>
                        </Switch>
                    )}
                </Show>
            </div>

            <div class={styles.panel}>
                <div class={styles.title}>VirtualScroll benchmark</div>

                <OptionRow label="Items" options={COUNT_OPTIONS} value={count()} disabled={running()} onSelect={setCount} />
                <OptionRow<ListLayout> label="Layout" options={['list', 'grid', 'chat']} value={listLayout()} disabled={running()} onSelect={setListLayout} />
                <OptionRow label="Speed" options={SPEED_OPTIONS} suffix="px/f" value={speed()} disabled={running()} onSelect={setSpeed} />
                <OptionRow label="Duration" options={DURATION_OPTIONS} suffix="s" value={duration()} disabled={running()} onSelect={setDuration} />
                <OptionRow label="Rounds" options={ROUND_OPTIONS} value={rounds()} disabled={running()} onSelect={setRounds} />

                <div class={styles.row}>
                    <div class={styles.rowLabel}>Live</div>
                    <For each={modesFor(listLayout())}>
                        {(mode) => (
                            <div
                                class={styles.btn}
                                classList={{ [styles.btnActive]: !running() && active()?.mode === mode, [styles.btnDisabled]: running() }}
                                onClick={() => startLive(mode)}
                            >
                                {mode}
                            </div>
                        )}
                    </For>
                </div>

                <div class={styles.row}>
                    <div class={`${styles.btn} ${styles.btnPrimary}`} classList={{ [styles.btnDisabled]: running() }} onClick={runBenchmark}>
                        Run benchmark
                    </div>
                    <div class={styles.btn} onClick={stop}>Stop</div>
                </div>

                <div class={styles.status}>{status()}</div>

                <Show when={live()}>
                    {(s) => (
                        <div class={styles.liveStats}>
                            <div>FPS {fmt(s().fps, 1)} · frame avg {fmt(s().frameAvg)}ms · p95 {fmt(s().frameP95)}ms</div>
                            <div>apply avg {fmt(s().applyAvg, 3)}ms · p95 {fmt(s().applyP95, 3)}ms · max {fmt(s().applyMax, 3)}ms</div>
                        </div>
                    )}
                </Show>

                <Show when={results().length}>
                    <div class={styles.table}>
                        <div class={`${styles.tr} ${styles.th}`}>
                            <div class={styles.tdMode}>Mode</div>
                            <div class={styles.td}>FPS</div>
                            <div class={styles.td}>Frame avg</div>
                            <div class={styles.td}>Frame p95</div>
                            <div class={styles.td}>Apply avg</div>
                            <div class={styles.td}>Apply p95</div>
                            <div class={styles.td}>Mount</div>
                            <div class={styles.td}>Warmup max</div>
                            <div class={styles.td}>DOM nodes</div>
                        </div>
                        <For each={results()}>
                            {(r) => (
                                <div class={styles.tr}>
                                    <div class={styles.tdMode}>{MODE_LABELS[r.mode]}</div>
                                    <div class={styles.td}>{fmt(r.fps, 1)}</div>
                                    <div class={styles.td}>
                                        {fmt(r.frameAvg)}
                                        <Show when={r.mode !== baseline()?.mode}>
                                            <span class={styles.rel}> {relative(r.frameAvg, baseline()?.frameAvg ?? 0)}</span>
                                        </Show>
                                    </div>
                                    <div class={styles.td}>{fmt(r.frameP95)}</div>
                                    <div class={styles.td}>
                                        {fmt(r.applyAvg, 3)}
                                        <Show when={r.mode !== baseline()?.mode}>
                                            <span class={styles.rel}> {relative(r.applyAvg, baseline()?.applyAvg ?? 0)}</span>
                                        </Show>
                                    </div>
                                    <div class={styles.td}>{fmt(r.applyP95, 3)}</div>
                                    <div class={styles.td}>{fmt(r.mountMs, 1)}</div>
                                    <div class={styles.td}>{fmt(r.warmupMaxFrame, 1)}</div>
                                    <div class={styles.td}>{fmt(r.nodes, 0)}</div>
                                </div>
                            )}
                        </For>
                        <div class={styles.note}>
                            Times in ms. % is relative to Recycle, or to Plain for the chat layout (+ = slower). Apply = scripting time of one scroll
                            step incl. the synchronous reactive updates; frame = rAF interval incl. engine
                            style/layout/paint. Mount = synchronous render time. Warmup max = worst frame in the first
                            second (pool / batch creation). DOM nodes counted at the end of the run. Full results are
                            logged to the console as JSON.
                        </div>
                    </div>
                </Show>
            </div>
        </div>
    );
};

export default VirtualScrollBench;
