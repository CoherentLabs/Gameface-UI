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
import MenuItems from '@custom-components/Menu/MenuItem/MenuItem';
import { Accessor, createContext, createSignal, For, Setter, Show } from 'solid-js';
import Gameplay from '@custom-components/Menu/Options/Gameplay/Gameplay';
import styles from './Menu.module.scss';
import { Column, Column4, Column6, Column8 } from '@components/Layout/Column/Column';
import SidePanel from '@custom-components/Menu/SidePanel/SidePanel';

interface MenuContextValue {
    currentOption: Accessor<string>,
    setCurrentOption: Setter<string>,
    activeTab: Accessor<typeof OPTIONS[number]>
}

export const MenuContext = createContext<MenuContextValue>();
export const OPTIONS = ['Gameplay', 'Graphics', 'Keybinds', 'Audio', 'Credits'] as const;

const Menu = () => {
    const [currentOption, setCurrentOption] = createSignal('difficulty');
    const [activeTab, setActiveTab] = createSignal<typeof OPTIONS[number]>(OPTIONS[0]);
    const MenuContextValue = {
        currentOption, 
        setCurrentOption,
        activeTab
    }

    return (
        <MenuContext.Provider value={MenuContextValue}>
            <div class={styles.Menu}>
                <Tabs onTabChanged={(newTab) => setActiveTab(newTab as any)} default={OPTIONS[0]}>
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
                                <Column8>
                                    <Scroll style={{width: '100%'}}>
                                        <Scroll.Content class={styles['scroll-content']}>
                                            <Tab location={OPTIONS[0]}>
                                                <Gameplay />
                                            </Tab>
                                            <Tab location={OPTIONS[1]}>
                                            </Tab>
                                            <Tab location={OPTIONS[2]}>
                                            </Tab>
                                            <Tab location={OPTIONS[3]}>
                                            </Tab>
                                            <Tab location={OPTIONS[4]}>
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
                            </Row>
                        </Content>
                        <Bottom>
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
                        </Bottom>
                    </Layout>
                </Tabs>
            </div>
        </MenuContext.Provider>
    );
};

export default Menu;
