import { createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import Navigation from '@components/Utility/Navigation/Navigation';
import { waitForFrames } from '@components/utils/waitForFrames';
import { defineFlow, OverlayHost, stateOf, useFlow, useOverlays } from '@components/Utility/Flow/Flow';
import FlowCard from './FlowCard';
import FlowPanel from './FlowPanel';
import './FlowTest.css';

/** The file argument stands in for the path the editor plugin injects in dev builds. */
export const FLOW_TEST_FILE = 'tests/src/components/Flow/FlowTest.tsx';

const focusable = (...ids: string[]) => Object.fromEntries(ids.map((id) => [id, { focusable: true }]));

const flow = defineFlow({
    states: [
        { name: 'Tabs', initial: 'Audio', states: [{ name: 'Audio' }, { name: 'Video' }] },
        { name: 'Save', initial: 'Has save', states: [{ name: 'Has save' }, { name: 'No save file', showWhen: { expr: 'noSave()' } }] },
    ],
    navigation: {
        screen: { firstFocus: 'flowbtn2' },
        elements: {
            ...focusable('flowbtn1', 'flowbtn2', 'flowbtn4', 'flowl1', 'flowl2', 'flowl3', 'flowe1', 'flowe2', 'flows1', 'flows2'),
            flowbtn3: { focusable: false },
        },
        areas: {
            flowarea1: { name: 'list', firstFocus: 'flowl2', wrap: false },
            flowarea2: { name: 'extras' },
            flowarea3: { name: 'side' },
        },
    },
    overlays: { Confirm: () => import('./FlowConfirm'), Plain: () => import('./FlowPlain') },
}, FLOW_TEST_FILE);

// Stands in for a CSS module: f.classes maps modifier names through it.
const styles: Record<string, string> = {
    'tabs--video': 'tabs--video',
    'save--no-save-file': 'save--no-save-file',
};

type Engine = { createJSModel?: (name: string, model: object) => void; synchronizeModels?: () => void };

const FlowTest = () => {
    const [noSave, setNoSave] = createSignal(false);
    const f = useFlow(flow, { states: { Save: () => (noSave() ? 'No save file' : undefined) } });
    const overlays = useOverlays();
    const [assertion, setAssertion] = createSignal('');
    const [entered, setEntered] = createSignal(0);
    const [edgeHits, setEdgeHits] = createSignal(0);
    let rootEl!: HTMLDivElement;

    f.state('Tabs').onEnter('Video', () => setEntered((n) => n + 1));

    const scenarios = [
        { label: 'Tabs: Video', action: () => f.state('Tabs').set('Video') },
        { label: 'Tabs: Audio', action: () => f.state('Tabs').set('Audio') },
        { label: 'Toggle no save', action: () => setNoSave((v) => !v) },
        { label: 'Set a following state', action: () => f.state('Save').set('No save file') },
        {
            label: 'Open overlay',
            action: async () => {
                const answer = await overlays.open('Confirm', { dim: true, closeOnBack: true });
                setAssertion(`closed:${answer}`);
            },
        },
        { label: 'stateOf: Video', action: () => stateOf(rootEl, 'Tabs')?.set('Video') },
        { label: 'Switch to list', action: () => f.nav.switchArea('list') },
        { label: 'Card: Open', action: () => stateOf(document.querySelector('.flow-card')!, 'Card')?.set('Open') },
        { label: 'Open plain overlay', action: () => overlays.open('Plain') },
    ];

    const reset = () => {
        while (window.__gfFlows?.overlays && (overlays.isOpen('Confirm') || overlays.isOpen('Plain'))) window.__gfFlows.overlays.close();
        const card = document.querySelector('.flow-card');
        if (card) stateOf(card, 'Card')?.set('Closed');
        f.state('Tabs').set('Audio');
        setNoSave(false);
        setAssertion('');
        setEntered(0);
        setEdgeHits(0);
    };

    onMount(() => {
        const engine = (globalThis as { engine?: Engine }).engine;
        engine?.createJSModel?.('FlowTestModel', { label: 'bound' });
        engine?.synchronizeModels?.();
        document.addEventListener('reset', reset);
        // Screen code's own edge handler: counts the hits and keeps focus at the edge.
        // A frame later, once <Navigation ref={f.nav}> has handed over its API.
        waitForFrames(() => f.nav.setEdgeHandler('side', () => {
            setEdgeHits((n) => n + 1);
            return false;
        }), 1);
    });
    onCleanup(() => document.removeEventListener('reset', reset));

    return (
        <Navigation ref={f.nav}>
            <div attr:data-gf-id="flowroot" class={`flow-root ${f.classes(styles)}`} ref={(el) => { rootEl = el; f.root(el); }}>
                <div class="flow-scenarios">
                    <For each={scenarios}>
                        {(sc, i) => <button class={`flow-scenario scenario-${i()}`} onClick={sc.action}>{sc.label}</button>}
                    </For>
                </div>
                <div class="flow-row"><div class="flow-label">Tabs</div><div class="flow-current-tabs">{f.state('Tabs').current()}</div></div>
                <div class="flow-row"><div class="flow-label">Save</div><div class="flow-current-save">{f.state('Save').current()}</div></div>
                <div class="flow-row"><div class="flow-label">Entered Video</div><div class="flow-entered">{entered()}</div></div>
                <div class="flow-row"><div class="flow-label">Overlay result</div><div class="flow-assert">{assertion()}</div></div>
                <div class="flow-row"><div class="flow-label">Side edge hits</div><div class="flow-edge-hits">{edgeHits()}</div></div>

                <div class="flow-row">
                    <div attr:data-gf-id="flowbtn1" class="flow-btn flow-btn-1">One</div>
                    <div attr:data-gf-id="flowbtn2" class="flow-btn flow-btn-2">Two</div>
                    <div attr:data-gf-id="flowbtn3" class="flow-btn flow-btn-3" tabindex="0">Three (not focusable)</div>
                </div>

                {/* Area "list": wrap off, first focus L2. */}
                <div attr:data-gf-id="flowarea1" class="flow-row flow-area">
                    <div attr:data-gf-id="flowl1" class="flow-btn flow-l1">L1</div>
                    <div attr:data-gf-id="flowl2" class="flow-btn flow-l2">L2 (first focus)</div>
                    <div attr:data-gf-id="flowl3" class="flow-btn flow-l3">L3</div>
                </div>

                {/* A component with its own flow and states. */}
                <FlowCard />

                {/* Area "side": the screen's code sets its edge handler; Video adds S2. */}
                <div attr:data-gf-id="flowarea3" class="flow-row flow-area">
                    <div attr:data-gf-id="flows1" class="flow-btn flow-s1">S1</div>
                    <Show when={f.state('Tabs').is('Video')}>
                        <div attr:data-gf-id="flows2" class="flow-btn flow-s2">S2 (Video only)</div>
                    </Show>
                </div>

                <Show when={f.state('Tabs').is('Video')}>
                    <div attr:data-gf-id="flowvideo" class="flow-video">
                        Only in Video. Bound value: <span class="flow-bound" data-bind-value="{{FlowTestModel.label}}"></span>
                        {/* A focusable element a state adds, so the screen area's elements change. */}
                        <div attr:data-gf-id="flowbtn4" class="flow-btn flow-btn-4">Four (Video only)</div>
                        {/* Area "extras": its container only exists in Video. */}
                        <div attr:data-gf-id="flowarea2" class="flow-row flow-area">
                            <div attr:data-gf-id="flowe1" class="flow-btn flow-e1">E1</div>
                            <div attr:data-gf-id="flowe2" class="flow-btn flow-e2">E2</div>
                        </div>
                        {/* A component with its own area, mounted by Video. */}
                        <FlowPanel />
                    </div>
                </Show>
            </div>
            <OverlayHost overlays={flow.overlays} />
        </Navigation>
    );
};

export default FlowTest;
