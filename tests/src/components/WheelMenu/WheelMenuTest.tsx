import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import WheelMenu, { WheelMenuRef } from "@components/Complex/WheelMenu/WheelMenu";
import BackgroundImage from "@components/Media/BackgroundImage/BackgroundImage";
import Weapon1 from "./assets/weapon1.png";
import Weapon2 from "./assets/weapon2.png";
import Weapon3 from "./assets/weapon3.png";
import Weapon4 from "./assets/weapon4.png";
import Weapon5 from "./assets/weapon5.png";
import Weapon6 from "./assets/weapon6.png";
import Center from "./assets/GameMessage_AchievmentIcon.png";
import selectors from "../../../shared/wheelMenu/wheel-menu-selectors.json";
import events from '../../../shared/wheelMenu/wheel-menu-events.json'
import items from '../../../shared/wheelMenu/wheel-item-ids.json'
import './wheel-menu-styles.css'
import Flex from "@components/Layout/Flex/Flex";

const wheelItems = [
    { id: items[0], img: Weapon1 },
    { id: items[1], img: Weapon2 },
    { id: items[2], img: Weapon3 },
    { id: items[3], img: Weapon4 },
    { id: items[4], img: Weapon5 },
    { id: items[5], img: Weapon6 },
]

const WheelMenuTest = () => {
    let wheelMenuRef!: WheelMenuRef;
    const [test, setTest] = createSignal('red');
    const [selected, setSelected] = createSignal(wheelItems[0].id);
    const [items, setItems] = createSignal(wheelItems);
    const [itemOffset, setItemOffset] = createSignal('1vmax');
    const [customIcon, setCustomIcon] = createSignal(false);

    const scenarios = [
        { label: events["open-menu"], action: () => { wheelMenuRef.open() } },
        { label: events["close-menu"], action: () => { wheelMenuRef.close() } },
        { label: events["change-gap"], action: () => { wheelMenuRef.changeGap(5) } },
        { label: events["select-item"], action: () => { wheelMenuRef.selectByIndex(1) } },
        { label: events["select-by-vector"], action: () => { wheelMenuRef.selectByVector(1, -1) } },
        { label: events["change-items"], action: () => { setItems(wheelItems.slice(0, wheelItems.length - 2)) } },
        { label: events["change-item-offset"], action: () => { setItemOffset("2vmax") } },
        { label: events["set-custom-icon"], action: () => { setCustomIcon(true) } },
        { label: events["change-styles"], action: () => { setTest('blue') } },
    ];

    const reset = () => {
        setTest('red');
        wheelMenuRef.open();
        setSelected(wheelItems[0].id);
        setItems(wheelItems);
        setItemOffset('1vmax');
        setCustomIcon(false);
        wheelMenuRef.selectByIndex(0);
        wheelMenuRef.changeGap(0);
    };

    const isReactive = createMemo(() => test() === 'blue');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset))

    return (
        <Tab location='wheel-menu'>
            <div class={selectors.assertionElement}>{selected()}</div>

            <Flex justify-content="start" align-items="center" wrap="wrap">
                <For each={scenarios}>
                    {(sc, i) => (
                        <button data-event={sc.label} onClick={sc.action} >
                            {sc.label}
                        </button>
                    )}
                </For>
            </Flex>

            <WheelMenu 
                ref={wheelMenuRef!} 
                opened
                gap={0}
                onChange={(id) => {setSelected(id as string)}}
                onItemChanged={() => {setSelected("item-changed")}}
                style={reactiveStyle()}
                class={`${selectors.wheelMenu} ${reactiveClass()}`}>
                <WheelMenu.Content 
                    style={reactiveStyle()}
                    class={`${selectors.wheelInner} ${reactiveClass()}`}>
                    <BackgroundImage class="center-image" src={Center} options={{size: 'contain', position: "center" }} />
                </WheelMenu.Content>
                <WheelMenu.Indicator class={`${selectors.wheelIndicator} ${reactiveClass()}`} style={reactiveStyle()}>
                    <WheelMenu.Indicator.Icon class={`${selectors.wheelIcon} ${reactiveClass()}`} style={reactiveStyle()} >
                        {customIcon() && <div class={selectors.customIcon} />}
                    </WheelMenu.Indicator.Icon>
                </WheelMenu.Indicator>
                <WheelMenu.Selector 
                    class={`${selectors.wheelSelector} ${reactiveClass()}`} 
                    class-selected={selectors.wheelSelectorSelected} 
                    style={reactiveStyle()}
                    style-selected={{"border-color": 'rgba(255, 0, 0, 1)'}}/>
                <For each={items()}>
                    {(item) => (
                        <WheelMenu.Item 
                            id={item.id}
                            offset={itemOffset()}
                            class={`${selectors.wheelItem} ${reactiveClass()}`} 
                            class-selected={selectors.wheelItemSelected}
                            style-selected={{"background-color": 'rgba(0, 0, 0, 0.1)'}}
                            style={reactiveStyle()}>
                            <div class="item-wrapper">
                                <BackgroundImage fill src={item.img} options={{size: 'contain', position: "center" }} />
                            </div>
                        </WheelMenu.Item>
                    )}
                </For>
            </WheelMenu>
        </Tab>
    )
}

export default WheelMenuTest;