import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import Scroll, { ScrollComponentRef } from "@components/Layout/Scroll/Scroll";
import Block from "@components/Layout/Block/Block";
import './scroll.css';

const ScrollTest = () => {
    let scrollRef!: ScrollComponentRef;
    const [direction, setDirection] = createSignal<'up' | 'down' | undefined>(undefined);
    const [overflow, setOverflow] = createSignal(false);
    const [customIcon, setCustomIcon] = createSignal(false);

    const scenarios = [
        { label: "Toggle scroll", action: () => setOverflow(prev => !prev)},
        { label: "Scroll up", action: () => scrollRef.scrollUp()},
        { label: "Scroll down", action: () => scrollRef.scrollDown()},
        { label: "Scroll to the begining", action: () => scrollRef.begin()},
        { label: "Scroll to the end", action: () => scrollRef.end()},
        { label: "Scroll to element", action: () => scrollRef.scrollToElement('.assertion-element')},
        { label: "Scroll element into view", action: () => scrollRef.scrollIntoView('.assertion-element')},
    ];

    const reset = () => {
        setDirection(undefined);
        setOverflow(false);
        scrollRef?.begin();
    };

    const isReactive = createMemo(() => direction() === 'down');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset)) 

    return (
        <Tab location='scroll'>
            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`scenario-btn scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <Scroll
                ref={scrollRef}
                onScroll={(args) => setDirection(args.scrollDirection)}
                style={reactiveStyle()} 
                class={`scroll ${reactiveClass()}`}>
                <Scroll.Content style={reactiveStyle()} class={`content ${reactiveClass()}`} >
                    <Block class="scroll-child">
                        I am a very long and dynamic text that can be scrolled
                    </Block>
                    <Show when={overflow()}>
                        <Block>
                        lorem Eaque, perspiciatis ad iusto expedita consectetur rerum tempora non nisi, porro tenetur repudiandae.
                            Voluptatem magni dolore consequuntur officia nemo quidem minus. Possimus, quibusdam.
                        </Block>
                        <div class="assertion-element" style={{width: '5vmax', height: '3vmax', 'background-color': 'green'}}>{direction()}</div>
                        <Block>
                            I am a very long and dynamic text that can be scrolled - lorem Eaque, perspiciatis ad iusto expedita consectetur rerum tempora non nisi, porro tenetur repudiandae.
                            Voluptatem magni dolore consequuntur officia nemo quidem minus. Possimus, quibusdam.
                        </Block>
                    </Show>
                </Scroll.Content>
                <Scroll.Bar style={reactiveStyle()} class={`bar ${reactiveClass()}`}>
                    <Scroll.Handle style={reactiveStyle()} class={`handle ${reactiveClass()}`} />
                </Scroll.Bar>
            </Scroll>
        </Tab> 
    )
}

export default ScrollTest;