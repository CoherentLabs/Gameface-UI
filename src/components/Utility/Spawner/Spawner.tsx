import {
    Accessor,
    batch,
    Component,
    createContext,
    createEffect,
    createMemo,
    createSignal,
    For,
    JSX,
    on,
    onCleanup,
    Setter,
    splitProps,
    untrack,
    useContext,
} from 'solid-js';
import { createStore, reconcile, SetStoreFunction } from 'solid-js/store';
import LayoutBase from '@components/Layout/LayoutBase';
import { ComponentBaseProps } from '@components/types/ComponentProps';
import { waitForCssExit } from '@components/utils/waitForCssExit';
import styles from './Spawner.module.scss';

/** Default cap for how long an item may wait for its hide before it is removed anyway. */
const DEFAULT_HIDE_TIMEOUT = 1000;

/** Global class on an item's wrapper while it hides, for CSS exit animations. */
export const SPAWNER_LEAVING_CLASS = 'spawner-leaving';

export type SpawnerData = Record<string, unknown>;

export interface SpawnOptions {
    /** Time in ms until the item is removed. Leave it out to keep the item until it is removed. */
    life?: number;
    /** Places the item absolutely at this point, in px relative to the Spawner. Leave it out to add the item to the Spawner's flow. */
    at?: { x: number; y: number };
}

export interface SpawnerItem {
    key: number;
    data: SpawnerData;
}

export interface SpawnerRef {
    element: HTMLDivElement;
    /** Adds an item and returns its key. */
    spawn: (data: SpawnerData, opts?: SpawnOptions) => number;
    /** Removes an item, after its hide. Does nothing for a key that is not shown. */
    remove: (key: number) => void;
    /** Removes every shown item, each after its hide. */
    clear: () => void;
    /** The shown items, oldest first. Items that are hiding are not included. */
    items: Accessor<readonly SpawnerItem[]>;
}

/**
 * What the template (or anything inside it) can do with the item it renders.
 * This is the seam for show and hide animations: `MotionShow` and similar wrappers
 * register through `onShow` and `onHide`.
 */
export interface SpawnerItemApi {
    /** The item's key. Changes when a pooled element is reused for a new item. */
    key: Accessor<number>;
    /** True while the item is hiding. */
    leaving: Accessor<boolean>;
    /**
     * Runs `fn` every time the item is shown: when it is first added and every time
     * its pooled element is reused. Returns a function that unregisters it.
     */
    onShow: (fn: () => void) => () => void;
    /**
     * Registers work that has to finish before the item is removed, e.g. a hide animation.
     * The item is removed once every registered function has resolved, or after `hideTimeout`.
     * Returns a function that unregisters it.
     */
    onHide: (fn: () => Promise<void> | void) => () => void;
    /** Removes the item, after its hide. */
    remove: () => void;
}

const SpawnerItemContext = createContext<SpawnerItemApi>();

/**
 * Gives anything inside a Spawner template access to its item: show and hide hooks, key, remove.
 *
 * With `pool`, a reused element keeps its template instance and this API for the next item.
 * Deferred work (a timeout, a promise) must check that `key()` is still the key it started with
 * before acting, or be cancelled in `onHide`; otherwise it acts on the next item.
 */
export const useSpawnerItem = () => useContext(SpawnerItemContext);

export interface SpawnerProps extends Omit<ComponentBaseProps, 'children'> {
    /** Most items shown at once. Above it the oldest is removed first. Empty or 0 = no limit. */
    max?: number;
    /** Keeps this many elements and reuses them instead of creating and destroying them. Empty or 0 = no reuse. */
    pool?: number;
    /** Longest time (ms) an item waits for its hide before it is removed anyway. Default 1000. */
    hideTimeout?: number;
    ref?: SpawnerRef | ((ref: SpawnerRef) => void);
    /** The template, rendered once per item. `data` is reactive: a reused element gets new data in place. */
    children: (data: any) => JSX.Element;
}

type SlotState = 'shown' | 'leaving' | 'idle';

interface Slot {
    /** Kept between reuses; only pooled slots are reused. */
    pooled: boolean;
    data: SpawnerData;
    setData: SetStoreFunction<SpawnerData>;
    key: Accessor<number>;
    setKey: Setter<number>;
    state: Accessor<SlotState>;
    setState: Setter<SlotState>;
    at: Accessor<SpawnOptions['at']>;
    setAt: Setter<SpawnOptions['at']>;
    showHooks: Set<() => void>;
    hideHooks: Set<() => Promise<void> | void>;
    lifeTimer?: ReturnType<typeof setTimeout>;
    hideCap?: ReturnType<typeof setTimeout>;
    /** Stops waiting for the CSS exit animation. */
    cancelCssExit?: () => void;
    /** Bumped on every show, so a hide that finishes after a reuse is ignored. */
    generation: number;
    element?: HTMLDivElement;
}

const Spawner: Component<SpawnerProps> = (props) => {
    const [, others] = splitProps(props, ['children', 'max', 'pool', 'hideTimeout']);
    const [slots, setSlots] = createSignal<Slot[]>([]);
    let nextKey = 1;
    let disposed = false;

    const hideTimeout = () => props.hideTimeout ?? DEFAULT_HIDE_TIMEOUT;
    const poolSize = () => Math.max(0, props.pool ?? 0);

    const items = createMemo<readonly SpawnerItem[]>(() =>
        slots()
            .filter((slot) => slot.state() === 'shown')
            // A shallow copy: a pooled slot's data changes to the next item's when its element is reused.
            .map((slot) => ({ key: slot.key(), data: { ...slot.data } }))
    );

    function createSlot(pooled: boolean): Slot {
        const [data, setData] = createStore<SpawnerData>({});
        const [key, setKey] = createSignal(0);
        const [state, setState] = createSignal<SlotState>('idle');
        const [at, setAt] = createSignal<SpawnOptions['at']>(undefined);
        return {
            pooled,
            data,
            setData,
            key,
            setKey,
            state,
            setState,
            at,
            setAt,
            showHooks: new Set(),
            hideHooks: new Set(),
            generation: 0,
        };
    }

    function clearTimers(slot: Slot) {
        clearTimeout(slot.lifeTimer);
        clearTimeout(slot.hideCap);
        slot.cancelCssExit?.();
        slot.lifeTimer = undefined;
        slot.hideCap = undefined;
        slot.cancelCssExit = undefined;
    }

    /** Drops idle pooled elements above the pool size. Shown ones above it are dropped when they finish hiding. */
    function trimPool() {
        const list = untrack(slots);
        let excess = list.filter((slot) => slot.pooled).length - poolSize();
        if (excess <= 0) return;
        const drop = new Set<Slot>();
        for (const slot of list) {
            if (excess === 0) break;
            if (slot.pooled && slot.state() === 'idle') {
                drop.add(slot);
                excess--;
            }
        }
        if (drop.size) setSlots(list.filter((slot) => !drop.has(slot)));
    }

    /** An idle pooled slot, or a new slot (pooled while the pool has room). */
    function takeSlot(): { list: Slot[]; slot: Slot; isNew: boolean } {
        trimPool();
        const list = untrack(slots);
        const idle = list.find((slot) => slot.pooled && slot.state() === 'idle');
        if (idle) return { list, slot: idle, isNew: false };
        const pooledCount = list.filter((slot) => slot.pooled).length;
        return { list, slot: createSlot(pooledCount < poolSize()), isNew: true };
    }

    // spawn, remove and clear run untracked: an effect that calls them must not subscribe to
    // the items' states, or each item that hides would re-run it.
    function spawn(data: SpawnerData, opts: SpawnOptions = {}): number {
        return untrack(() => spawnItem(data, opts));
    }

    function spawnItem(data: SpawnerData, opts: SpawnOptions): number {
        const key = nextKey++;

        batch(() => {
            const { list, slot, isNew } = takeSlot();

            slot.generation++;
            slot.setData(reconcile({ ...data }));
            slot.setAt(opts.at ? { x: opts.at.x, y: opts.at.y } : undefined);
            slot.setKey(key);
            slot.setState('shown');

            // Newest last, so items in the Spawner's flow keep their spawn order.
            // A reused element is moved, not recreated.
            setSlots(isNew ? [...list, slot] : [...list.filter((other) => other !== slot), slot]);

            if (opts.life !== undefined && opts.life >= 0) {
                slot.lifeTimer = setTimeout(() => hide(slot), opts.life);
            }

            const max = props.max ?? 0;
            if (max > 0) {
                const shown = untrack(slots).filter((other) => other.state() === 'shown');
                for (let i = 0; i < shown.length - max; i++) hide(shown[i]);
            }
        });

        return key;
    }

    function finishHide(slot: Slot) {
        clearTimers(slot);
        if (disposed) return;

        const list = untrack(slots);
        const pooledCount = list.filter((other) => other.pooled).length;
        // Keep the element when it belongs to the pool, unless the pool was made smaller.
        if (slot.pooled && pooledCount <= poolSize()) {
            slot.setState('idle');
        } else {
            setSlots(list.filter((other) => other !== slot));
        }
    }

    /** Marks the item as leaving, waits for its hide, then removes it (or returns it to the pool). */
    function hide(slot: Slot) {
        if (untrack(slot.state) !== 'shown') return;
        clearTimers(slot);

        const generation = slot.generation;
        const wrapper = slot.element;
        // Started before the leaving class is applied, so no animationstart is missed
        const cssExit = wrapper ? waitForCssExit([wrapper, wrapper.firstElementChild]) : undefined;
        slot.cancelCssExit = cssExit?.cancel;

        slot.setState('leaving');

        const waits: Promise<void>[] = [...slot.hideHooks].map((fn) =>
            Promise.resolve()
                .then(fn)
                .catch((error) => console.error('Spawner hide hook failed', error))
        );
        if (cssExit) waits.push(cssExit.promise);

        const done = () => {
            if (slot.generation !== generation || untrack(slot.state) !== 'leaving') return;
            finishHide(slot);
        };

        if (waits.length === 0) return done();

        slot.hideCap = setTimeout(done, hideTimeout());
        Promise.all(waits).then(done);
    }

    function remove(key: number) {
        untrack(() => {
            const slot = slots().find((other) => other.state() === 'shown' && other.key() === key);
            if (slot) hide(slot);
        });
    }

    function clear() {
        untrack(() => batch(() => slots().forEach(hide)));
    }

    // A smaller pool frees its idle elements right away, not only on the next spawn.
    createEffect(on(poolSize, trimPool, { defer: true }));

    onCleanup(() => {
        disposed = true;
        untrack(slots).forEach(clearTimers);
    });

    const refObject: Omit<SpawnerRef, 'element'> = { spawn, remove, clear, items };

    const renderSlot = (slot: Slot) => {
        const api: SpawnerItemApi = {
            key: slot.key,
            leaving: () => slot.state() === 'leaving',
            onShow: (fn) => {
                slot.showHooks.add(fn);
                return () => slot.showHooks.delete(fn);
            },
            onHide: (fn) => {
                slot.hideHooks.add(fn);
                return () => slot.hideHooks.delete(fn);
            },
            remove: () => hide(slot),
        };

        const runShowHooks = () => {
            if (disposed || untrack(slot.state) !== 'shown') return;
            slot.showHooks.forEach((fn) => {
                try {
                    fn();
                } catch (error) {
                    console.error('Spawner show hook failed', error);
                }
            });
        };

        // Runs on the first show and every time the pooled element is reused for a new key.
        // This effect is created before the template renders, so it runs before the template's
        // own effects; deferring to a microtask lets hooks registered from the template's
        // onMount or createEffect run on the first show too.
        createEffect(on(slot.key, () => void Promise.resolve().then(runShowHooks)));

        const wrapperStyle = (): JSX.CSSProperties => {
            const at = slot.at();
            return {
                display: slot.state() === 'idle' ? 'none' : undefined,
                position: at ? 'absolute' : undefined,
                left: at ? `${at.x}px` : undefined,
                top: at ? `${at.y}px` : undefined,
            };
        };

        return (
            <div
                ref={(el) => (slot.element = el)}
                class={styles['spawner-item']}
                classList={{ [SPAWNER_LEAVING_CLASS]: slot.state() === 'leaving' }}
                data-spawner-state={slot.state()}
                style={wrapperStyle()}
            >
                <SpawnerItemContext.Provider value={api}>
                    {props.children(slot.data)}
                </SpawnerItemContext.Provider>
            </div>
        );
    };

    return (
        <LayoutBase
            {...others}
            componentClasses={styles.spawner}
            refObject={refObject}
        >
            <For each={slots()}>{renderSlot}</For>
        </LayoutBase>
    );
};

export default Spawner;
