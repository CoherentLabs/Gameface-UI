import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import BackgroundImage from "@components/Media/BackgroundImage/BackgroundImage";
import Weapon1 from "@assets/wheel/weapon1.png";
import Weapon2 from "@assets/wheel/weapon2.png";
import Weapon3 from "@assets/wheel/weapon3.png";
import Weapon4 from "@assets/wheel/weapon4.png";
import Weapon5 from "@assets/wheel/weapon5.png";
import Weapon6 from "@assets/wheel/weapon6.png";
import Center from "@assets/wheel/GameMessage_AchievmentIcon.png";
import selectors from "../../../shared/radialMenu/radial-menu-selectors.json";
import events from '../../../shared/radialMenu/radial-menu-events.json'
import items from '../../../shared/radialMenu/radial-menu-item-ids.json'
import './radial-menu-styles.css'
import Flex from "@components/Layout/Flex/Flex";
import RadialMenu, { RadialMenuRef } from "@components/Complex/RadialMenu/RadialMenu";

const menuItems = [
    { id: items[0], img: Weapon1 },
    { id: items[1], img: Weapon2 },
    { id: items[2], img: Weapon3 },
    { id: items[3], img: Weapon4 },
    { id: items[4], img: Weapon5 },
    { id: items[5], img: Weapon6 },
]

const RadialMenuTest = () => {
    let radialMenuRef!: RadialMenuRef;
    const [test, setTest] = createSignal('red');
    const [selected, setSelected] = createSignal(menuItems[0].id);
    const [items, setItems] = createSignal(menuItems);
    const [itemOffset, setItemOffset] = createSignal('1vmax');
    const [customIcon, setCustomIcon] = createSignal(false);

    const scenarios = [
        { label: events["open-menu"], action: () => { radialMenuRef.open() } },
        { label: events["close-menu"], action: () => { radialMenuRef.close() } },
        { label: events["change-gap"], action: () => { radialMenuRef.changeGap(5) } },
        { label: events["select-item"], action: () => { radialMenuRef.selectByIndex(1) } },
        { label: events["select-by-vector"], action: () => { radialMenuRef.selectByVector(1, -1) } },
        { label: events["change-items"], action: () => { setItems(menuItems.slice(0, menuItems.length - 2)) } },
        { label: events["change-item-offset"], action: () => { setItemOffset("2vmax") } },
        { label: events["set-custom-icon"], action: () => { setCustomIcon(true) } },
        { label: events["change-styles"], action: () => { setTest('blue') } },
    ];

    const reset = () => {
        setTest('red');
        radialMenuRef?.open();
        setSelected(menuItems[0].id);
        setItems(menuItems);
        setItemOffset('1vmax');
        setCustomIcon(false);
        radialMenuRef?.selectByIndex(0);
        radialMenuRef?.changeGap(0);
    };

    const isReactive = createMemo(() => test() === 'blue');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset))

    return (
        <Tab location='radial-menu'>
            <div class={selectors.assertionElement}>{selected()}</div>

            <Flex justify-content="start" align-items="center" wrap="wrap" style={{"max-width": '30vw'}}>
                <For each={scenarios}>
                    {(sc, i) => (
                        <button data-event={sc.label} onClick={sc.action} >
                            {sc.label}
                        </button>
                    )}
                </For>
            </Flex>

            <RadialMenu 
                ref={radialMenuRef!} 
                opened
                gap={0}
                onChange={(id) => {setSelected(id as string)}}
                onItemChanged={() => {setSelected("item-changed")}}
                style={reactiveStyle()}
                class={`${selectors.radialMenu} ${reactiveClass()}`}>
                <RadialMenu.Content 
                    style={reactiveStyle()}
                    class={`${selectors.menuContent} ${reactiveClass()}`}>
                    <BackgroundImage class="center-image" src={Center} options={{size: 'contain', position: "center" }} />
                </RadialMenu.Content>
                <RadialMenu.Indicator class={`${selectors.menuIndicator} ${reactiveClass()}`} style={reactiveStyle()}>
                    <RadialMenu.Indicator.Icon class={`${selectors.menuIcon} ${reactiveClass()}`} style={reactiveStyle()} >
                        {customIcon() && <div class={selectors.customIcon} />}
                    </RadialMenu.Indicator.Icon>
                </RadialMenu.Indicator>
                <RadialMenu.Selector 
                    class={`${selectors.menuSelector} ${reactiveClass()}`} 
                    class-selected={selectors.menuSelectorSelected} 
                    style={reactiveStyle()}
                    style-selected={{"border-color": 'rgba(255, 0, 0, 1)'}}/>
                <For each={items()}>
                    {(item) => (
                        <RadialMenu.Item 
                            id={item.id}
                            offset={itemOffset()}
                            class={`${selectors.menuItem} ${reactiveClass()}`} 
                            class-selected={selectors.menuItemSelected}
                            style-selected={{"background-color": 'rgba(0, 0, 0, 0.1)'}}
                            style={reactiveStyle()}>
                            <div class="item-wrapper">
                                <BackgroundImage fill src={item.img} options={{size: 'contain', position: "center" }} />
                            </div>
                        </RadialMenu.Item>
                    )}
                </For>
            </RadialMenu>
        </Tab>
    )
}

export default RadialMenuTest;