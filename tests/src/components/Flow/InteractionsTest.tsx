import { createSignal, For, onCleanup, onMount } from 'solid-js';
import Navigation from '@components/Utility/Navigation/Navigation';
import Button from '@components/Basic/Button/Button';
import {
    defineFlow, defineGameEvents, defineInputActions, InputHint, navigate, onGameEvent, onScreenHide, onScreenShow,
    playSound, registerGlyphs, setInputBinding, resetInputBindings, setPlatform, setStyleMode, useFlow, useHold,
    useInputAction, useInputKeys,
} from '@components/Utility/Flow/Flow';
import xboxA from '@assets/icons/gamepad/xbox/a.png';
import xboxB from '@assets/icons/gamepad/xbox/b.png';
import ps5Cross from '@assets/icons/gamepad/ps5/cross.png';
import switchA from '@assets/icons/gamepad/switch/a.png';
import switchB from '@assets/icons/gamepad/switch/b.png';
import './FlowTest.css';

// Stands in for the project's src/input/actions.ts.
const actions = defineInputActions({
    confirm: { keyboard: ['ENTER'], xbox: ['face-button-down'], playstation: ['face-button-down'], switch: ['face-button-right'] },
    interact: { keyboard: ['E'], xbox: ['face-button-left'], playstation: ['face-button-left'], switch: ['face-button-top'] },
    charge: { keyboard: ['H'] },
    drop: { keyboard: ['R'] },
    combo: { keyboard: ['C'] },
    modifier: { keyboard: ['Q'] },
    dash: { keyboard: ['D'] },
    pick: { mouse: ['click'] },
    fire: { xbox: ['left-shoulder-bottom'], playstation: ['left-shoulder-bottom'], switch: ['left-shoulder-bottom'] },
    // Navigation already has "back". No Switch binding, so A (face-button-down) runs no row on Switch.
    back: { keyboard: ['ESC'], xbox: ['face-button-right'], playstation: ['face-button-right'] },
});

// Stands in for the project's src/game/events.ts.
const gameEvents = defineGameEvents({
    playerHit: { direction: 'listen', args: { damage: 'number' } },
});

// Glyph sets normally come from src/assets/glyphs/<platform>/; the test points a few at existing icons.
// Vite imports images as URLs (the docs' Astro types say otherwise).
const url = (image: unknown) => image as string;
registerGlyphs({
    'xbox/face-button-down': url(xboxA),
    'xbox/face-button-right': url(xboxB),
    'playstation/face-button-down': url(ps5Cross),
    'switch/face-button-right': url(switchA),
    'switch/face-button-down': url(switchB),
    'pc/enter': url(xboxA),
});

const flow = defineFlow({ navigation: { elements: { ixscoped: { focusable: true }, ixheld: { focusable: true } } } });

const InteractionsTest = () => {
    const f = useFlow(flow);
    const [log, setLog] = createSignal<string[]>([]);
    const [shown, setShown] = createSignal(0);
    const add = (entry: string) => setLog((l) => [...l, entry]);
    let scoped!: HTMLDivElement;
    let held!: HTMLDivElement;

    onScreenShow(() => setShown((n) => n + 1));
    onScreenHide(() => add('hide'));

    // Screen rows, and an element row with stopHere for the same input.
    useInputAction(actions.interact, () => add('screen-interact'));
    useInputAction(actions.interact, () => add('element-interact'), { scope: () => scoped, stopHere: true });
    useInputAction(actions.confirm, () => add('confirm'));
    const charge = useInputAction(actions.charge, () => add('charged'), { on: 'held', holdMs: 1000 });
    useInputAction(actions.drop, () => add('dropped'), { on: 'released' });
    useInputAction(actions.combo, () => add('plain-c'));
    useInputAction(actions.combo, () => add('combo'), { combo: { with: actions.modifier } });
    useInputAction(actions.dash, () => add('single'));
    useInputAction(actions.dash, () => add('double'), { double: true });
    useInputKeys({ key: ['F1'] }, () => add('f1'));
    useInputAction(actions.pick, () => add('pick'), { scope: () => scoped });
    useInputAction(actions.fire, () => add('fire'), { threshold: 0.6 });
    useInputAction(actions.back, () => add('back'));
    const hold = useHold(() => held, () => add('held'), { ms: 1000 });

    onGameEvent(gameEvents.playerHit, (damage) => add(`hit:${damage}`));

    const scenarios = [
        { label: 'Platform: pc', action: () => setPlatform('pc') },
        { label: 'Platform: switch', action: () => setPlatform('switch') },
        { label: 'Go to Settings', action: () => navigate('Settings', { tab: 'audio' }) },
        { label: 'Play sound', action: () => playSound('buy') },
        { label: 'Remap confirm to F2', action: () => setInputBinding(actions.confirm, 'keyboard', ['F2']) },
        { label: 'Style mode: colorblind', action: () => setStyleMode('colorblind') },
        { label: 'Unbind back from the keyboard', action: () => setInputBinding(actions.back, 'keyboard', null) },
    ];

    const reset = () => {
        setLog([]);
        setPlatform('pc');
        setStyleMode('');
        resetInputBindings();
    };

    onMount(() => document.addEventListener('reset', reset));
    onCleanup(() => document.removeEventListener('reset', reset));

    return (
        <Navigation ref={f.nav}>
            <div attr:data-gf-id="ixroot" class="flow-root" ref={f.root}>
                <div class="flow-scenarios">
                    <For each={scenarios}>
                        {(sc, i) => <button class={`flow-scenario ix-scenario-${i()}`} onClick={sc.action}>{sc.label}</button>}
                    </For>
                </div>
                <div class="flow-row"><div class="flow-label">Log</div><div class="ix-log">{log().join(',')}</div></div>
                <div class="flow-row"><div class="flow-label">Shown</div><div class="ix-shown">{shown()}</div></div>
                <div class="flow-row"><div class="flow-label">Charge</div><div class="ix-charge">{charge() > 0 ? 'charging' : 'idle'}</div></div>
                <div class="flow-row"><div class="flow-label">Hold</div><div class="ix-hold">{hold() > 0 ? 'holding' : 'idle'}</div></div>
                <div class="flow-row">
                    <div attr:data-gf-id="ixscoped" class="flow-btn ix-scoped" ref={scoped}>Scoped</div>
                    <div attr:data-gf-id="ixheld" class="flow-btn ix-held" ref={held}>Hold me</div>
                    <Button class="flow-btn ix-onaction" onAction={{ confirm: () => add('onaction-confirm') }}>onAction</Button>
                </div>
                <div class="flow-row">
                    <InputHint action={actions.confirm} label="Confirm" labelKey="input.confirm" class="ix-hint" />
                </div>
            </div>
        </Navigation>
    );
};

export default InteractionsTest;
