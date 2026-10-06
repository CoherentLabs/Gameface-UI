import { Show, createSignal, onCleanup, onMount } from "solid-js";
import Trackers, { updateTrackers } from "@components/Performance/Trackers/Trackers";
import './trackers.css';
import selectors from "../../../shared/trackers-selectors.json";

const TRACKERS_ID = 'test-trackers';
const UNKNOWN_TRACKERS_ID = 'test-trackers-does-not-exist';

// Item4 is the one mounted/unmounted repeatedly by the "Toggle item4" button -
// the mount count lets a test tell a fresh mount apart from the previous one
// (same id, new element) after it's been torn down and brought back.
function Item4(props: { onItemMount: () => void }) {
    onMount(() => props.onItemMount());

    return <Trackers.Item id="t4" class={selectors.item4} />;
}

const TrackersTest = () => {
    const [trackersMounted, setTrackersMounted] = createSignal(true);
    const [item4Mounted, setItem4Mounted] = createSignal(false);
    const [item4MountCount, setItem4MountCount] = createSignal(0);
    const [scale5, setScale5] = createSignal(1);
    const [rotate5, setRotate5] = createSignal(0);

    const reset = () => {
        setTrackersMounted(true);
        setItem4Mounted(false);
        setItem4MountCount(0);
        setScale5(1);
        setRotate5(0);
        updateTrackers(TRACKERS_ID, [
            { id: 't1', x: 0, y: 0, hide: false },
            { id: 't2', x: 0, y: 0, hide: false },
            { id: 't3', x: 0, y: 0, hide: false },
            { id: 't5', x: 0, y: 0, hide: false },
        ]);
    };

    onMount(() => document.addEventListener('reset', reset));
    onCleanup(() => document.removeEventListener('reset', reset));

    const moveItem1 = () => updateTrackers(TRACKERS_ID, { id: 't1', x: 50, y: 60 });
    const hideItem2 = () => updateTrackers(TRACKERS_ID, { id: 't2', hide: true });
    const showItem2 = () => updateTrackers(TRACKERS_ID, { id: 't2', x: 0, y: 0 });
    const moveBatch = () => updateTrackers(TRACKERS_ID, [
        { id: 't1', x: 10, y: 10 },
        { id: 't3', x: 20, y: 20 },
    ]);
    // Also exercised while item4 isn't mounted (or the whole <Trackers> isn't
    // mounted) - dispatch()/updateTracker() should silently no-op, never throw.
    const moveItem4 = () => updateTrackers(TRACKERS_ID, { id: 't4', x: 70, y: 80 });
    const moveUnknownTrackers = () => updateTrackers(UNKNOWN_TRACKERS_ID, { id: 'x', x: 0, y: 0 });

    const moveItem5 = () => updateTrackers(TRACKERS_ID, { id: 't5', x: 30, y: 40 });
    const setScale5To2 = () => setScale5(2);
    const setRotate5To80 = () => setRotate5(80);

    return (
        <>
            <div class={selectors.assertionElement}>{item4MountCount()}</div>

            <button onClick={() => setTrackersMounted((m) => !m)} class={selectors.toggleTrackersMounted}>Toggle Trackers mounted</button>
            <button onClick={() => setItem4Mounted((m) => !m)} class={selectors.toggleItem4}>Toggle item4</button>
            <button onClick={moveItem1} class={selectors.moveItem1}>Move item1</button>
            <button onClick={hideItem2} class={selectors.hideItem2}>Hide item2</button>
            <button onClick={showItem2} class={selectors.showItem2}>Show item2</button>
            <button onClick={moveBatch} class={selectors.moveBatch}>Move batch</button>
            <button onClick={moveItem4} class={selectors.moveItem4}>Move item4</button>
            <button onClick={moveUnknownTrackers} class={selectors.moveUnknownTrackers}>Move unknown trackers</button>
            <button onClick={moveItem5} class={selectors.moveItem5}>Move item5</button>
            <button onClick={setScale5To2} class={selectors.setScale5}>Set item5 scale</button>
            <button onClick={setRotate5To80} class={selectors.setRotate5}>Set item5 rotate</button>

            <Show when={trackersMounted()}>
                <Trackers id={TRACKERS_ID} class={selectors.trackersLayer}>
                    <Trackers.Item id="t1" class={selectors.item1} />
                    <Trackers.Item id="t2" class={selectors.item2} />
                    <Trackers.Item id="t3" class={selectors.item3} />
                    <Show when={item4Mounted()}>
                        <Item4 onItemMount={() => setItem4MountCount((c) => c + 1)} />
                    </Show>
                    <Trackers.Item id="t5" class={selectors.item5} scale={scale5} rotate={rotate5} />
                </Trackers>
            </Show>
        </>
    );
};

export default TrackersTest;
