import { createSignal, createMemo, onMount, onCleanup, For } from "solid-js";
import { Dynamic } from "solid-js/web";
import grandeImage from '@assets/icons/hud/grenade.png'
import weaponImage from '@assets/icons/hud/weapon.png'
import xboxA from '@assets/icons/gamepad/xbox/a.png'
import Image from "@components/Media/Image/Image";
import MaskImage from "@components/Media/MaskImage/MaskImage";
import LiveView from "@components/Media/LiveView/LiveView";
import './media.css';
import selectors from "../../../shared/media-selectors.json";

const MediaTest = () => {
    const [reactivity, setReactivity] = createSignal(false);
    const [src, setSrc] = createSignal(grandeImage);
    const [options, setOptions] = createSignal<any>({position: "center", repeat: 'x', size: 'cover'});
    const [fill, setFill] = createSignal(false);
    // Drives the computed dot path, the only form that pulls a whole folder.
    const [glyph, setGlyph] = createSignal<'a' | 'b'>('a');

    const scenarios = [
        { label: "Change image", action: () => setSrc(weaponImage)},
        { label: "Change options", action: () => setOptions({position: "right", repeat: 'y', size: 'contain'})},
        { label: "Enable fill", action: () => setFill(true)},
        { label: "Set reactivity to true", action: () => setReactivity(true)},
        { label: "Change glyph", action: () => setGlyph('b')},
    ];

    const reset = () => {
        setReactivity(false);
        setSrc(grandeImage);
        setOptions({position: "center", repeat: 'x', size: 'cover'});
        setFill(false);
        setGlyph('a');
    };

    const isReactive = createMemo(() => reactivity() === true);
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset))

    return (
        <>
            <div class={selectors.assertionElement}>{reactivity()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            {/* Plain source, no options: the default 3.5rem contain/center image. */}
            <Image click={() => setReactivity(true)} src={src()} style={reactiveStyle()} class={`${selectors.image} ${reactiveClass()}`} fill={fill()} />
            <LiveView click={() => setReactivity(true)} src={src()} style={reactiveStyle()} class={`${selectors.liveView} ${reactiveClass()}`} fill={fill()} />

            {/* With options both components drop to background/mask mode. */}
            <Image click={() => setReactivity(true)} options={options()} src={src()} style={reactiveStyle()} class={`${selectors.imageOptions} ${reactiveClass()}`}>
              <div>Background content</div>
            </Image>
            <MaskImage click={() => setReactivity(true)} src={src()} options={options()}  style={reactiveStyle()} class={`${selectors.maskImage} ${reactiveClass()}`} >
              <div>
                Masked content
                Masked content
                Masked content
                Masked content
                Masked content
              </div>
            </MaskImage>

            {/* The dot path, and the same file imported by hand - both must resolve to one asset. */}
            <Image.icons.gamepad.xbox.a class={selectors.imageDot} />
            <Image src={xboxA} class={selectors.imageDotRef} />

            {/* A computed key: the plugin hands out the whole xbox folder as components. */}
            <Dynamic component={Image.icons.gamepad.xbox[glyph()]} class={selectors.imageDynamic} />

            {/* Option values the stylesheet has no class for fall through to inline styles. */}
            <Image src={src()} options={{ size: '50px 50px', position: '10px 20px' }} class={selectors.imageCustomOptions} />
        </>
    )
}

export default MediaTest;
