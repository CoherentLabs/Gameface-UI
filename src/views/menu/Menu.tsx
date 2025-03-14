import { Column6 } from '@components/Layout/Column/Column';
import styles from './Menu.module.css';
import Row from '@components/Layout/Row/Row';
import Block from '@components/Layout/Block/Block';
import Flex from '@components/Layout/Flex/Flex';
import Tabs from '@components/Layout/Tabs/Tabs';
import TabLink from '@components/Layout/TabLink/TabLink';
import Tab from '@components/Layout/Tab/Tab';
import Layout from '@components/Layout/Layout/Layout';
import Top from '@components/Layout/Top/Top';
import Content from '@components/Layout/Content/Content';
import Bottom from '@components/Layout/Bottom/Bottom';
import Scroll from '@components/Layout/Scroll/Scroll';
import MenuItems from '@custom-components/Menu/MenuItems/MenuItems';
import { For } from 'solid-js';

const Menu = () => {
    return (
        <div class={styles.Menu}>
            <Row style={{ height: '100%' }}>
                <Tabs default="Gameplay">
                    <Column6>
                        <Layout>
                            <Top>
                                <Flex
                                    style={{ height: '20%', 'padding-left': '10vh', 'padding-top': '10vh' }}
                                    align-items="center"
                                >
                                    <h2 style={{ 'text-transform': 'uppercase' }}>Options</h2>
                                </Flex>
                            </Top>
                            <Content>
                                <Block style={{ 'padding-top': '10vh' }}>
                                    <For each={['Gameplay', 'Graphics', 'Keybinds', 'Audio', 'Credits']}>
                                        {(tab) => {
                                            return <TabLink class={styles.link} location={tab} activeClass={styles.linkActive}>
                                                <Flex align-items="center" style={{ width: '100%', height: '100%' }}>
                                                    {tab}
                                                </Flex>
                                            </TabLink>
                                        }}
                                    </For>
                                </Block>
                            </Content>
                            <Bottom>
                                <Row style={{ 'padding-left': '10vh', 'text-transform': 'uppercase' }}>
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
                    </Column6>
                    <Column6>
                        <Layout>
                            <Top></Top>
                            <Content>
                                <Scroll style={{ 'max-height': '60vh', width: '90%' }}>
                                    <Tab location="Gameplay">
                                        <MenuItems count={40} />
                                    </Tab>
                                    <Tab location="Graphics">
                                        <MenuItems count={5} />
                                    </Tab>
                                    <Tab location="Keybinds">
                                        <MenuItems count={60} />
                                    </Tab>
                                    <Tab location="Audio">
                                        <MenuItems count={20} />
                                    </Tab>
                                    <Tab location="Credits">
                                        <MenuItems count={2} />
                                    </Tab>
                                </Scroll>
                            </Content>
                            <Bottom></Bottom>
                        </Layout>
                    </Column6>
                </Tabs>
            </Row>
        </div>
    );
};

export default Menu;
