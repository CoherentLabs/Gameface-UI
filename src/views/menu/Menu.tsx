import Row from '@components/Layout/Row/Row';
import Block from '@components/Layout/Block/Block';
import Flex from '@components/Layout/Flex/Flex';
import Tabs, { TabsComponentRef } from '@components/Layout/Tabs/Tabs';
import TabLink from '@components/Layout/TabLink/TabLink';
import Tab from '@components/Layout/Tab/Tab';
import Layout from '@components/Layout/Layout/Layout';
import Top from '@components/Layout/Top/Top';
import Content from '@components/Layout/Content/Content';
import Bottom from '@components/Layout/Bottom/Bottom';
import Scroll from '@components/Layout/Scroll/Scroll';
import { Accessor, batch, createContext, createMemo, createSignal, For, onMount, Setter, Show } from 'solid-js';
import Gameplay from '@custom-components/Menu/Options/Gameplay/Gameplay';
import styles from './Menu.module.scss';
import { Column12, Column4, Column8 } from '@components/Layout/Column/Column';
import SidePanel from '@custom-components/Menu/SidePanel/SidePanel';
import Graphics from '@custom-components/Menu/Options/Graphics/Graphics';
import { getFirstOptionOfTab } from './util';
import KeyBinds from '@custom-components/Menu/Options/KeyBinds/KeyBinds';
import Audio from '@custom-components/Menu/Options/Audio/Audio';
import Credits from '@custom-components/Menu/Options/Credits/Credits';
import CustomModal from '@custom-components/Menu/CustomModal/CustomModal';
import { ModalRef } from '@components/Feedback/Modal/Modal';
import eventBus from '@components/tools/EventBus';

interface MenuContextValue {
    currentOption: Accessor<string>,
    setCurrentOption: Setter<string>,
    activeTab: Accessor<typeof OPTIONS[number]>
}

export const MenuContext = createContext<MenuContextValue>();
export const OPTIONS = ['Gameplay', 'Graphics', 'Keybinds', 'Audio', 'Credits'] as const;

const Menu = () => {
    let modalRef!: ModalRef;
    const [currentOption, setCurrentOption] = createSignal('difficulty');
    const [hasChanges, setHasChanges] = createSignal(false);
    const [activeTab, setActiveTab] = createSignal<typeof OPTIONS[number]>(OPTIONS[0]);
    let nextTab: string | undefined;
    let tabsRef!: TabsComponentRef;
    const MenuContextValue = {
        currentOption, 
        setCurrentOption,
        activeTab
    }

    const handleTabChange = (newTab: string) => {
        batch(() => {
            setActiveTab(newTab as typeof OPTIONS[number]);
            setCurrentOption(getFirstOptionOfTab(newTab))
        });
    }
            
    const handleBeforeTabChange = (currentLocation: string, newLocation: string) => {
        if (hasChanges()) {
            modalRef.open();
            setHasChanges(false);
            nextTab = newLocation;
            return false;
        }
    }

    const handleModalClose = () => {
        if (!nextTab) return;

        tabsRef.changeTab(nextTab);
    }

    onMount(() => {
        eventBus.on('ui-change', () => setHasChanges(true))
    })

    const isCredits = createMemo(() => activeTab() === OPTIONS[4])

    return (
        <MenuContext.Provider value={MenuContextValue}>
            <div class={styles.Menu}>
                <Tabs ref={tabsRef} onBeforeTabChange={handleBeforeTabChange} onTabChanged={handleTabChange} default={OPTIONS[0]}>
                    <Layout>
                        <Top class={styles.top}>
                            <Flex>
                                <h2 style={{ 'text-transform': 'uppercase' }}>Options</h2>
                            </Flex>
                            <Flex direction='row'>
                                <For each={OPTIONS}>
                                    {(tab) => {
                                        return <TabLink class={styles.link} location={tab} activeClass={styles.active}>
                                            <Flex align-items="center" justify-content='center'>{tab}</Flex>
                                        </TabLink>
                                    }}
                                </For>
                            </Flex>
                        </Top>
                        <Content class={styles.content}>
                            <Row>
                                <Show when={!isCredits()}>
                                    <Column8>
                                        <Scroll style={{width: '100%'}}>
                                            <Scroll.Content class={styles['scroll-content']}>
                                                <Tab location={OPTIONS[0]}>
                                                    <Gameplay />
                                                </Tab>
                                                <Tab location={OPTIONS[1]}>
                                                    <Graphics />
                                                </Tab>
                                                <Tab location={OPTIONS[2]}>
                                                    <KeyBinds />
                                                </Tab>
                                                <Tab location={OPTIONS[3]}>
                                                    <Audio />
                                                </Tab>
                                            </Scroll.Content>
                                            <Scroll.Bar class={styles['scroll-bar']}>
                                                <Scroll.Handle class={styles['scroll-handle']} />
                                            </Scroll.Bar>
                                        </Scroll>
                                    </Column8>
                                    <Column4>
                                        <SidePanel option={currentOption()} />
                                    </Column4>
                                </Show>
                                <Show when={isCredits()}>
                                    <Column12>
                                        <Tab location={OPTIONS[4]}>
                                            <Credits />
                                        </Tab>
                                    </Column12>
                                </Show>
                            </Row>
                        </Content>
                        <Bottom>
                            <Show when={!isCredits()}>
                                <Row class={styles['button-wrapper']}>
                                    <Flex align-items="center">
                                        <Block class={styles.button}>Escape</Block> Exit
                                    </Flex>
                                    <Flex align-items="center">
                                        <Block class={styles.button}>Enter</Block> Select
                                    </Flex>
                                    <Flex align-items="center">
                                        <Block class={styles.button}>E</Block> Defaults
                                    </Flex>
                                </Row>
                            </Show>
                        </Bottom>
                    </Layout>
                </Tabs>
            </div>
            <CustomModal ref={modalRef} onClose={handleModalClose} />
        </MenuContext.Provider>
    );
};

export default Menu;
