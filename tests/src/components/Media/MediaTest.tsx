import Tab from "@components/Layout/Tab/Tab";
import { createSignal, createMemo, onMount, onCleanup, For } from "solid-js";
import grandeImage from '@assets/grenade.png'
import weaponImage from '@assets/weapon.png'
import Image from "@components/Media/Image/Image";
import BackgroundImage from "@components/Media/BackgroundImage/BackgroundImage";
import MaskImage from "@components/Media/MaskImage/MaskImage";
import LiveView from "@components/Media/LiveView/LiveView";
import './media.css';
import selectors from "../../../shared/media-selectors.json";

const MediaTest = () => {
    const [reactivity, setReactivity] = createSignal(false);
    const [src, setSrc] = createSignal(grandeImage);
    const [options, setOptions] = createSignal<any>({position: "center", repeat: 'x', size: 'cover'});

    const scenarios = [
        { label: "Change image", action: () => setSrc(weaponImage)},
        { label: "Change options", action: () => setOptions({position: "right", repeat: 'y', size: 'contain'})},
    ];

    const reset = () => {
        setReactivity(false);
        setSrc(grandeImage);
        setOptions({position: "center", repeat: 'x', size: 'cover'});
    };

    const isReactive = createMemo(() => reactivity() === true);
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset)) 

    return (
        <Tab location='media'>
            <div class={selectors.assertionElement}>{reactivity()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <Image click={() => setReactivity(true)} src={src()} style={reactiveStyle()} class={`${selectors.image} ${reactiveClass()}`} />
            <LiveView click={() => setReactivity(true)} src={src()} style={reactiveStyle()} class={`${selectors.liveView} ${reactiveClass()}`} />
            <BackgroundImage click={() => setReactivity(true)} options={options()} src={src()} style={reactiveStyle()} class={`${selectors.backgroundImage} ${reactiveClass()}`} />
            <MaskImage click={() => setReactivity(true)} src={src()} options={options()}  style={reactiveStyle()} class={`${selectors.maskImage} ${reactiveClass()}`}>
              <div>
                Masked content
                Masked content
                Masked content
                Masked content
                Masked content
              </div>
            </MaskImage>
        </Tab> 
    )
}

export default MediaTest;