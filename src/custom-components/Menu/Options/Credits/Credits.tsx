import { For, onCleanup, onMount } from "solid-js"
import { CREDITS } from "./creditsContent"
import List from "@components/Layout/List/List"
import TextBlock from "@components/Basic/TextBlock/TextBlock";
import Scroll, { ScrollComponentRef } from "@components/Layout/Scroll/Scroll";
import style from './Credits.module.scss';
import menuStyles from '../../../../views/menu/Menu.module.scss';

const Credits = () => {
    let scrollRef!: ScrollComponentRef;
    let interval: NodeJS.Timeout;

    const scrollCredits = () => {
        scrollRef.scrollDown();

        const contentWrapper = scrollRef.element?.firstChild as HTMLDivElement;
        const scrollWrapper = contentWrapper?.firstChild as HTMLDivElement;
        const maxScroll = scrollWrapper?.scrollHeight;
        const scrollTop = contentWrapper.scrollHeight + scrollWrapper?.scrollTop;

        if (scrollTop >= maxScroll) clearInterval(interval);
    }

    const handleOnScroll = (direction: string) => {
        if (direction === 'up') clearInterval(interval)
    } 
    
    onMount(() => {
        interval = setInterval(scrollCredits, 500)
    })

    onCleanup(() => clearInterval(interval))

    return (
        <Scroll onScroll={(arg) => handleOnScroll(arg.scrollDirection)} ref={scrollRef}>
            <Scroll.Content class={menuStyles['scroll-content']}>
                <List bullet-type="none" class={style['credits-list']}>
                    <For each={CREDITS}>
                        {(c) => (
                            <List.Item class={style['credits-item']}>
                                <h2 class={style['credits-item-heading']}>{c.section}</h2>
                                <List bullet-type="none" class={style['credits-list']}>
                                    <For each={c.entries}>{(e) => (
                                        <List.Item class={style['credits-entry']}>
                                            <h3 class={style['credits-entry-heading']}>{e.role}</h3>
                                            <TextBlock class={style['credits-entry-name']}>{e.name}</TextBlock>
                                        </List.Item>        
                                    )}</For>
                                </List>
                            </List.Item>
                        )}
                    </For>
                </List>
            </Scroll.Content>
            <Scroll.Bar class={menuStyles['scroll-bar']}>
                <Scroll.Handle class={menuStyles['scroll-handle']} />
            </Scroll.Bar>
        </Scroll>
    )
}

export default Credits