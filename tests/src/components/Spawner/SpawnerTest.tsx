import { createSignal, onCleanup, onMount, Show } from 'solid-js';
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
        setMounted(true);
    };

    onMount(() => {
        document.addEventListener('spawner-spawn', onSpawn);
        document.addEventListener('spawner-remove-first', onRemoveFirst);
        document.addEventListener('spawner-clear', onClear);
        document.addEventListener('reset', reset);
    });
    onCleanup(() => {
        document.removeEventListener('spawner-spawn', onSpawn);
        document.removeEventListener('spawner-remove-first', onRemoveFirst);
        document.removeEventListener('spawner-clear', onClear);
        document.removeEventListener('reset', reset);
    });

    return (
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
    );
};

export default SpawnerTest;
