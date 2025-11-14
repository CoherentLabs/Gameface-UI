import Block from '@components/Layout/Block/Block';
import { Column4 } from '@components/Layout/Column/Column';
import Flex from '@components/Layout/Flex/Flex';
import Row from '@components/Layout/Row/Row';
import Image from '@components/Media/Image/Image';
import TopBar from '@custom-components/Hud/TopBar/TopBar';
import KillsList from '@custom-components/Hud/KillsList/KillsList';
import StatusBar from '@custom-components/Hud/StatusBar/StatusBar';
import Weapons from '@custom-components/Hud/Weapons/Weapons';
import styles from './Hud.module.css';
import crosshair from '@assets/crosshair.png';
import RadialMenu, { RadialMenuRef } from '@components/Complex/RadialMenu/RadialMenu';
import { For, onCleanup, onMount } from 'solid-js';
import Weapon1 from "@assets/wheel/weapon1.png";
import Weapon2 from "@assets/wheel/weapon2.png";
import Weapon3 from "@assets/wheel/weapon3.png";
import Weapon4 from "@assets/wheel/weapon4.png";
import Weapon5 from "@assets/wheel/weapon5.png";
import Weapon6 from "@assets/wheel/weapon6.png";
import Center from "@assets/wheel/GameMessage_AchievmentIcon.png";
import BackgroundImage from '@components/Media/BackgroundImage/BackgroundImage';

const wheelItems = [
    { id: "shotgun", img: Weapon1 },
    { id: "pistol", img: Weapon2 },
    { id: "rifle", img: Weapon3 },
    { id: "sniper", img: Weapon4 },
    { id: "smg", img: Weapon5 },
    { id: "grenade", img: Weapon6 },
]

const Hud = () => {
    let radialMenuRef: RadialMenuRef | undefined;
    let radialMenuRef2: RadialMenuRef | undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'ShiftLeft') {
            radialMenuRef?.open();
        }

        if (e.code === 'ShiftRight') {
            radialMenuRef2?.open();
        }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'ShiftLeft') {
            radialMenuRef?.close();
        }

        if (e.code === 'ShiftRight') {
            radialMenuRef2?.close();
        }
    }

    onMount(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    });
    return (
        <div class={styles.Hud}>
            <RadialMenu ref={radialMenuRef}>
                <RadialMenu.Content  style={{width: '50%', height: '50%'}}>
                    <BackgroundImage style={{width: '80%', height: '80%'}} src={Center} options={{size: 'contain', position: "center" }} />
                </RadialMenu.Content>
                <For each={wheelItems}>
                    {(item) => (
                        <RadialMenu.Item id={item.id}>
                            <div style={{ width: '5vmax', height: '5vmax' }}>
                                <BackgroundImage fill src={item.img} options={{size: 'contain', position: "center" }} />
                            </div>
                        </RadialMenu.Item>
                    )}
                </For>
            </RadialMenu>

            <RadialMenu ref={radialMenuRef2} gap={1}>
                <RadialMenu.Selector style={{"border-width": '5vmax'}} />
                <RadialMenu.Content style={{'background-color': '#0000002e'}}/>
                <RadialMenu.Indicator style={{'border-color': '#3e3d5dff'}}/>
                <For each={wheelItems}>
                    {(item) => (
                        <RadialMenu.Item id={item.id} style-selected={{ transform: 'scale(1.1)' }} style={{transition: 'transform 0.2s linear'}}>
                            <div style={{ width: '3.5vmax', height: '3.5vmax' }}>
                                <BackgroundImage fill src={item.img} options={{size: 'contain', position: "center" }} />
                            </div>
                        </RadialMenu.Item>
                    )}
                </For>
            </RadialMenu>

            <Row style={{ height: '33%' }}>
                <Column4>
                    <Block class={styles.miniMap}></Block>
                </Column4>
                <Column4>
                    <TopBar />
                </Column4>
                <Column4>
                    <KillsList />
                </Column4>
            </Row>
            <Row style={{ height: '33%' }}>
                <Column4></Column4>
                <Column4>
                    <Flex style={{ width: '100%', height: '100%' }} align-items="center" justify-content="center">
                        <Image style={{ width: '7vh', height: '7vh' }} src={crosshair}></Image>
                    </Flex>
                </Column4>
                <Column4></Column4>
            </Row>
            <Row style={{ height: '33%' }}>
                <Column4>
                    <StatusBar />
                </Column4>
                <Column4></Column4>
                <Column4>
                    <Weapons />
                </Column4>
            </Row>
        </div>
    );
};

export default Hud;
