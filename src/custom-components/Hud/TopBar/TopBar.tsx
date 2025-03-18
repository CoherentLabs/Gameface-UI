import Block from "@components/Layout/Block/Block";
import Flex from "@components/Layout/Flex/Flex";
import Image from "@components/Media/Image/Image";

import placeholder from '@assets/placeholder.png';
import styles from './TopBar.module.css';
import { For } from "solid-js";

const badges = Array.from({ length: 5 }, (_, i) => i);

const TopBar = () => {
    return <Flex style={{ width: '100%', height: '100%' }} align-items="center" direction="column">
        <Block class={styles.topBar}></Block>
        <Flex justify-content="space-between" style={{ margin: '3vh 0' }}>
            <For each={badges}>
                {() => {
                    return <Block class={styles.heroBadge}>
                        <Image src={placeholder} class={styles.badgeImage}></Image>
                    </Block>
                }}
            </For>
            <For each={badges}>
                {() => {
                    return <Block class={styles.enemyBadge}>
                        <Image src={placeholder} class={styles.badgeImage}></Image>
                    </Block>
                }}
            </For>
        </Flex>
        <Flex justify-content="center">
            <Block class={styles.counter}>9</Block>
            <Block class={styles.counter}>1:36</Block>
            <Block class={styles.counter}>5</Block>
        </Flex>
    </Flex>
}

export default TopBar;