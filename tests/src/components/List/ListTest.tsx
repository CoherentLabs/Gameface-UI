import Tab from "@components/Layout/Tab/Tab";
import { createSignal, createMemo, onMount, onCleanup, For, Accessor } from "solid-js";
import selectors from "../../../shared/list-selectors.json";
import List from "@components/Layout/List/List";
import PlusIcon from './plusIcon.svg?component-solid';
import BulletImage from './plusIcon.svg';
import './list.css'

type NestedListData = Array<string | NestedListData>;

const ListTest = () => {
    const [test, setTest] = createSignal("red");
    const [bulletType, setBulletType] = createSignal<'disc'|'circle'|'square'|'number'|'none'|any>('disc');
    const [bulletClass, setBulletClass] = createSignal('');
    const [useImageBullet, setUseImageBullet] = createSignal(false);
    const [ordered, setOrdered] = createSignal(false)
    const [hasCustomIcon, setHasCustomIcon] = createSignal(false);
    const data: NestedListData = [
        "Item 1",
        ["Nested A", "Nested B", ["Deep 1", "Deep 2"], ],
        "Item 2",
        "Item 3"
    ];
 
    const reset = () => {
        setOrdered(false);
        setHasCustomIcon(false);
        setTest("red");
        setBulletType('disc');
        setBulletClass('');
        setUseImageBullet(false)
    };

    const scenarios = [
        { label: "Change list type", action: () => setOrdered(true)},
        { label: "Set custom icon", action: () => setHasCustomIcon(true)},
        { label: "bullet: square", action: () => setBulletType('square') },
        { label: "bullet: circle", action: () => setBulletType('circle') },
        { label: "bullet: number", action: () => setBulletType('number') },
        { label: "bullet: none", action: () => setBulletType('none') },
        { label: "bullet: image", action: () => { setUseImageBullet(true) } },
        { label: "apply bullet-class", action: () => setBulletClass(selectors.bulletClass) },
    ];

    const isReactive = createMemo(() => test() === "blue");
    const reactiveClass = createMemo(() => (isReactive() ? "reactive" : ""));
    const reactiveStyle = createMemo(() => (isReactive() ? { "background-color": "blue" } : {}));

    onMount(() => document.addEventListener("reset", reset));
    onCleanup(() => document.removeEventListener("reset", reset));

    function renderList(items: NestedListData) {
        return (
            <List
                type={ordered() ? 'ordered' : 'unordered'}
                bullet-type={useImageBullet() ? BulletImage : bulletType()}
                bullet-class={bulletClass()}
                style={reactiveStyle()}
                click={() => setTest("blue")}
                class={`${selectors.base} ${reactiveClass()}`}
                >
                <For each={items}>
                    {(item) => {
                        const isNested = Array.isArray(item);
                        return (
                            <List.Item 
                                class={`${selectors.listItem} ${reactiveClass()}`}
                                style={reactiveStyle()}>
                                    <List.Icon 
                                        class={`${selectors.listIcon} ${reactiveClass()}`} 
                                        style={{...reactiveStyle(), display: `${isNested ? 'none' : ''}`}}>
                                        {hasCustomIcon() && <PlusIcon class="custom-icon" />}
                                    </List.Icon>
                                    {isNested ? renderList(item) : item}
                            </List.Item>    
                            )
                        }
                    }
                </For>
            </List>
        );
    }

    return (
        <Tab location="list">
            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            {renderList(data)}
        </Tab>
    );
};

export default ListTest;