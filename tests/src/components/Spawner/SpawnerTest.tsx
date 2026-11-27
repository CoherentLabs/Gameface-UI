import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js';
import { render } from 'solid-js/web';
import Spawner, { SpawnerRef, useSpawnerItem } from '@components/Utility/Spawner/Spawner';
import './SpawnerTest.css';

import selectors from '../../../shared/spawner-selectors.json';

// Keep in sync with tests/specs/spawner.spec.js
const MAX_COUNT = 3;
const POOL_SIZE = 2;
const HIDE_TIMEOUT = 600;
/** Long enough that the CSS exit test can tell animationend from the cap */
const CSS_HIDE_TIMEOUT = 3000;

type Target = 'flow' | 'pooled' | 'hooks' | 'css';

interface SpawnDetail {
    target: Target;
    text?: string;
    life?: number;
    at?: { x: number; y: number };
    /** ms the item's hide hook takes; -1 = never resolves */
    hideDelay?: number;
}

/** Counts created template elements, so reuse can be told apart from re-creation. */
let created = 0;

const Entry = (props: { data: any }) => {
    const item = useSpawnerItem();
    const uid = ++created;
    const [shows, setShows] = createSignal(0);

    item?.onShow(() => setShows((n) => n + 1));
    item?.onHide(() => {
        const delay = props.data.hideDelay;
        if (delay === undefined) return;
        if (delay < 0) return new Promise<void>(() => {});
        return new Promise<void>((resolve) => setTimeout(resolve, delay));
    });

    return (
        <div
            class={selectors.entry}
            data-uid={uid}
            data-key={item?.key()}
            data-shows={shows()}
        >
            {props.data.text}
        </div>
    );
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const frames = (n: number) =>
    new Promise<void>((resolve) => {
        const tick = () => (n-- <= 0 ? resolve() : requestAnimationFrame(tick));
        tick();
    });
const countIn = (host: HTMLElement, state: string) => host.querySelectorAll(`[data-spawner-state="${state}"]`).length;

/**
 * Scenarios that need their own Spawner setup. Each one mounts into `host`, runs to the end and
 * returns its result, which the page writes to `data-scenario` on <body> for the spec to read.
 */
const scenarios: Record<string, (host: HTMLElement) => Promise<object>> = {
    /** An effect that spawns an item with a life, in a Spawner with max */
    'effect-spawn': async (host) => {
        let spawns = 0;
        let ref!: SpawnerRef;
        const [trigger, setTrigger] = createSignal(0);
        const dispose = render(() => {
            createEffect(() => {
                // Capped, so a looping effect can't hang the page
                if (trigger() > 0 && spawns < 50) {
                    spawns++;
                    ref.spawn({ text: 'kill' }, { life: 100 });
                }
            });
            return <Spawner ref={(r) => (ref = r)} max={5} hideTimeout={50}>{(data) => <div>{data.text}</div>}</Spawner>;
        }, host);
        setTrigger(1);
        await wait(1500);
        dispose();
        return { spawns };
    },

    /** A template that registers a show hook while rendering and another from onMount */
    'show-hook-on-mount': async (host) => {
        let duringRender = 0;
        let fromOnMount = 0;
        let ref!: SpawnerRef;
        const Template = () => {
            const item = useSpawnerItem()!;
            item.onShow(() => duringRender++);
            onMount(() => item.onShow(() => fromOnMount++));
            return <div>x</div>;
        };
        const dispose = render(() => <Spawner ref={(r) => (ref = r)}>{() => <Template />}</Spawner>, host);
        ref.spawn({});
        await frames(10);
        dispose();
        return { duringRender, fromOnMount };
    },

    /** With pool 1: an entry saved from items() after its element is reused for the next item */
    'saved-entry': async (host) => {
        let ref!: SpawnerRef;
        let templates = 0;
        const dispose = render(
            () => (
                <Spawner ref={(r) => (ref = r)} pool={1} hideTimeout={50}>
                    {(data) => {
                        templates++;
                        return <div>{data.text}</div>;
                    }}
                </Spawner>
            ),
            host
        );
        ref.spawn({ text: 'A' });
        const saved = ref.items()[0];
        ref.remove(saved.key);
        await wait(300);
        ref.spawn({ text: 'B' });
        const result = { templates, shown: ref.items().map((i) => i.data.text), savedText: saved.data.text };
        dispose();
        return result;
    },

    /** Three idle pooled elements, then the pool is changed to `to` (and an item spawned) */
    'pool-change': async (host) => {
        const to = Number(host.dataset.to);
        let ref!: SpawnerRef;
        let templates = 0;
        const [pool, setPool] = createSignal(3);
        const dispose = render(
            () => (
                <Spawner ref={(r) => (ref = r)} pool={pool()} hideTimeout={50}>
                    {(data) => {
                        templates++;
                        return <div>{data.text}</div>;
                    }}
                </Spawner>
            ),
            host
        );
        ['1', '2', '3'].forEach((text) => ref.spawn({ text }));
        ref.clear();
        await wait(300);
        const idleBefore = countIn(host, 'idle');
        setPool(to);
        await wait(100);
        const idleAfterChange = countIn(host, 'idle');
        const templatesBeforeSpawn = templates;
        ref.spawn({ text: 'new' });
        await frames(2);
        const result = {
            idleBefore,
            idleAfterChange,
            idleAfterSpawn: countIn(host, 'idle'),
            newElements: templates - templatesBeforeSpawn,
        };
        dispose();
        return result;
    },

    /** With pool 1, a 1 s exit animation and hideTimeout 100: five items spawned and removed in turn */
    'cut-short-exit': async (host) => {
        // Counts the animationend listeners added to and removed from elements in the host
        const live = new Set<string>();
        let added = 0;
        let ids = 0;
        const listenerIds = new WeakMap<object, string>();
        const id = (el: object, fn: object) => {
            if (!listenerIds.has(fn)) listenerIds.set(fn, String(++ids));
            if (!listenerIds.has(el)) listenerIds.set(el, String(++ids));
            return `${listenerIds.get(el)}:${listenerIds.get(fn)}`;
        };
        const add = Element.prototype.addEventListener;
        const remove = Element.prototype.removeEventListener;
        Element.prototype.addEventListener = function (this: Element, type: string, fn: any, ...rest: any[]) {
            if (type === 'animationend' && host.contains(this)) {
                added++;
                live.add(id(this, fn));
            }
            return (add as any).call(this, type, fn, ...rest);
        } as typeof add;
        Element.prototype.removeEventListener = function (this: Element, type: string, fn: any, ...rest: any[]) {
            if (type === 'animationend') live.delete(id(this, fn));
            return (remove as any).call(this, type, fn, ...rest);
        } as typeof remove;

        try {
            let ref!: SpawnerRef;
            const dispose = render(
                () => (
                    <Spawner class={selectors.slowExit} ref={(r) => (ref = r)} pool={1} hideTimeout={100}>
                        {(data) => <div>{data.text}</div>}
                    </Spawner>
                ),
                host
            );
            // Counted after each cut-short hide, before the next hide or unmount could clean up
            let left = 0;
            for (let i = 0; i < 5; i++) {
                ref.spawn({ text: String(i) });
                await frames(2);
                ref.remove(ref.items()[0].key);
                await wait(300);
                left = Math.max(left, live.size);
            }
            dispose();
            return { added, left };
        } finally {
            Element.prototype.addEventListener = add;
            Element.prototype.removeEventListener = remove;
        }
    },
};

const SpawnerTest = () => {
    const [mounted, setMounted] = createSignal(true);
    const refs: Partial<Record<Target, SpawnerRef>> = {};

    const onSpawn = (event: Event) => {
        const { target, text, life, at, hideDelay } = (event as CustomEvent<SpawnDetail>).detail;
        refs[target]?.spawn({ text: text ?? 'Item', hideDelay }, { life, at });
    };
    const onRemoveFirst = (event: Event) => {
        const ref = refs[(event as CustomEvent<{ target: Target }>).detail.target];
        const first = ref?.items()[0];
        if (first) ref!.remove(first.key);
    };
    const onClear = (event: Event) => refs[(event as CustomEvent<{ target: Target }>).detail.target]?.clear();
    const reset = () => {
        // Remount, so every test starts with empty Spawners and fresh pools.
        setMounted(false);
        created = 0;
        document.body.removeAttribute('data-scenario');
        setMounted(true);
    };

    let scenarioHost!: HTMLDivElement;
    const onScenario = async (event: Event) => {
        const { name, to } = (event as CustomEvent<{ name: string; to?: number }>).detail;
        document.body.removeAttribute('data-scenario');
        const host = document.createElement('div');
        if (to !== undefined) host.dataset.to = String(to);
        scenarioHost.appendChild(host);
        let result: object;
        try {
            result = await scenarios[name](host);
        } catch (error) {
            result = { error: String(error) };
        }
        host.remove();
        document.body.setAttribute('data-scenario', JSON.stringify({ name, ...result }));
    };

    onMount(() => {
        document.addEventListener('spawner-spawn', onSpawn);
        document.addEventListener('spawner-remove-first', onRemoveFirst);
        document.addEventListener('spawner-clear', onClear);
        document.addEventListener('spawner-scenario', onScenario);
        document.addEventListener('reset', reset);
    });
    onCleanup(() => {
        document.removeEventListener('spawner-spawn', onSpawn);
        document.removeEventListener('spawner-remove-first', onRemoveFirst);
        document.removeEventListener('spawner-clear', onClear);
        document.removeEventListener('spawner-scenario', onScenario);
        document.removeEventListener('reset', reset);
    });

    return (
        <>
        <div ref={scenarioHost} />
        <Show when={mounted()}>
            <Spawner class={`${selectors.spawner} ${selectors.flow}`} ref={(r) => (refs.flow = r)} max={MAX_COUNT}>
                {(data) => <Entry data={data} />}
            </Spawner>
            <Spawner class={`${selectors.spawner} ${selectors.pooled}`} ref={(r) => (refs.pooled = r)} pool={POOL_SIZE}>
                {(data) => <Entry data={data} />}
            </Spawner>
            <Spawner class={`${selectors.spawner} ${selectors.hooks}`} ref={(r) => (refs.hooks = r)} hideTimeout={HIDE_TIMEOUT}>
                {(data) => <Entry data={data} />}
            </Spawner>
            <Spawner class={`${selectors.spawner} ${selectors.css}`} ref={(r) => (refs.css = r)} hideTimeout={CSS_HIDE_TIMEOUT}>
                {(data) => <Entry data={data} />}
            </Spawner>
        </Show>
        </>
    );
};

export default SpawnerTest;
