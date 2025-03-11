import { Column6 } from '@components/Layout/Column/Column';
import styles from './Menu.module.css';
import Row from '@components/Layout/Row/Row';
import Block from '@components/Layout/Block/Block';
import Flex from '@components/Layout/Flex/Flex';
import Tabs from '@components/Layout/Tabs/Tabs';
import TabLink from '@components/Layout/TabLink/TabLink';
import Tab from '@components/Layout/Tab/Tab';
import State from '@components/Basic/State/State';
import { Match } from 'solid-js';
import Layout from '@components/Layout/Layout/Layout';
import Top from '@components/Layout/Top/Top';
import Content from '@components/Layout/Content/Content';
import Bottom from '@components/Layout/Bottom/Bottom';
import Scroll from '@components/Layout/Scroll/Scroll';

const Menu = () => {
    const testSettings = (number: number) => {
        return [...Array(number).map((elemnt) => (elemnt = ''))];
    };

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
                                    <TabLink class={styles.link} location="Gameplay" activeClass={styles.linkActive}>
                                        <Flex align-items="center" style={{ width: '100%', height: '100%' }}>
                                            Gameplay
                                        </Flex>
                                    </TabLink>
                                    <TabLink class={styles.link} location="Graphics" activeClass={styles.linkActive}>
                                        <Flex align-items="center" style={{ width: '100%', height: '100%' }}>
                                            Graphics
                                        </Flex>
                                    </TabLink>
                                    <TabLink class={styles.link} location="Keybinds" activeClass={styles.linkActive}>
                                        <Flex align-items="center" style={{ width: '100%', height: '100%' }}>
                                            Keybinds
                                        </Flex>
                                    </TabLink>
                                    <TabLink class={styles.link} location="Audio" activeClass={styles.linkActive}>
                                        <Flex align-items="center" style={{ width: '100%', height: '100%' }}>
                                            Audio
                                        </Flex>
                                    </TabLink>
                                    <TabLink class={styles.link} location="Credits" activeClass={styles.linkActive}>
                                        <Flex align-items="center" style={{ width: '100%', height: '100%' }}>
                                            Credits
                                        </Flex>
                                    </TabLink>
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
                                        {testSettings(40).map((_, index) => {
                                            return (
                                                <Block
                                                    style={{
                                                        border: '0.1vh solid white',
                                                        'background-color': 'rgba(0, 0, 0, 0.3)',
                                                        width: '100%',
                                                        height: '8vh',
                                                        margin: '0.7vh 0',
                                                    }}
                                                >
                                                    <Flex
                                                        justify-content="space-between"
                                                        align-items="center"
                                                        style={{ height: '100%', 'padding-left': '1vh' }}
                                                    >
                                                        Setting Item
                                                        <Flex align-items="center" style={{ height: '100%' }}>
                                                            <Block
                                                                style={{
                                                                    height: '70%',
                                                                    width: '18vh',
                                                                    'background-color': 'black',
                                                                    border: '0.2vh solid white',
                                                                }}
                                                            ></Block>
                                                            <Block
                                                                style={{
                                                                    height: '70%',
                                                                    width: '18vh',
                                                                    'background-color': 'black',
                                                                    border: '0.2vh solid white',
                                                                    margin: '0 2vh',
                                                                }}
                                                            ></Block>
                                                        </Flex>
                                                    </Flex>
                                                </Block>
                                            );
                                        })}
                                    </Tab>
                                    <Tab location="Graphics">
                                        {testSettings(5).map((_, index) => {
                                            return (
                                                <Block
                                                    style={{
                                                        border: '0.1vh solid white',
                                                        'background-color': 'rgba(0, 0, 0, 0.3)',
                                                        width: '100%',
                                                        height: '8vh',
                                                        margin: '0.7vh 0',
                                                    }}
                                                >
                                                    <Flex
                                                        justify-content="space-between"
                                                        align-items="center"
                                                        style={{ height: '100%', 'padding-left': '1vh' }}
                                                    >
                                                        Setting Item
                                                        <Flex align-items="center" style={{ height: '100%' }}>
                                                            <Block
                                                                style={{
                                                                    height: '70%',
                                                                    width: '18vh',
                                                                    'background-color': 'black',
                                                                    border: '0.2vh solid white',
                                                                }}
                                                            ></Block>
                                                            <Block
                                                                style={{
                                                                    height: '70%',
                                                                    width: '18vh',
                                                                    'background-color': 'black',
                                                                    border: '0.2vh solid white',
                                                                    margin: '0 2vh',
                                                                }}
                                                            ></Block>
                                                        </Flex>
                                                    </Flex>
                                                </Block>
                                            );
                                        })}
                                    </Tab>
                                    <Tab location="Keybinds">
                                        {testSettings(60).map((_, index) => {
                                            return (
                                                <Block
                                                    style={{
                                                        border: '0.1vh solid white',
                                                        'background-color': 'rgba(0, 0, 0, 0.3)',
                                                        width: '100%',
                                                        height: '8vh',
                                                        margin: '0.7vh 0',
                                                    }}
                                                >
                                                    <Flex
                                                        justify-content="space-between"
                                                        align-items="center"
                                                        style={{ height: '100%', 'padding-left': '1vh' }}
                                                    >
                                                        Setting Item
                                                        <Flex align-items="center" style={{ height: '100%' }}>
                                                            <Block
                                                                style={{
                                                                    height: '70%',
                                                                    width: '18vh',
                                                                    'background-color': 'black',
                                                                    border: '0.2vh solid white',
                                                                }}
                                                            ></Block>
                                                            <Block
                                                                style={{
                                                                    height: '70%',
                                                                    width: '18vh',
                                                                    'background-color': 'black',
                                                                    border: '0.2vh solid white',
                                                                    margin: '0 2vh',
                                                                }}
                                                            ></Block>
                                                        </Flex>
                                                    </Flex>
                                                </Block>
                                            );
                                        })}
                                    </Tab>
                                    <Tab location="Audio">
                                        {testSettings(20).map((_, index) => {
                                            return (
                                                <Block
                                                    style={{
                                                        border: '0.1vh solid white',
                                                        'background-color': 'rgba(0, 0, 0, 0.3)',
                                                        width: '100%',
                                                        height: '8vh',
                                                        margin: '0.7vh 0',
                                                    }}
                                                >
                                                    <Flex
                                                        justify-content="space-between"
                                                        align-items="center"
                                                        style={{ height: '100%', 'padding-left': '1vh' }}
                                                    >
                                                        Setting Item
                                                        <Flex align-items="center" style={{ height: '100%' }}>
                                                            <Block
                                                                style={{
                                                                    height: '70%',
                                                                    width: '18vh',
                                                                    'background-color': 'black',
                                                                    border: '0.2vh solid white',
                                                                }}
                                                            ></Block>
                                                            <Block
                                                                style={{
                                                                    height: '70%',
                                                                    width: '18vh',
                                                                    'background-color': 'black',
                                                                    border: '0.2vh solid white',
                                                                    margin: '0 2vh',
                                                                }}
                                                            ></Block>
                                                        </Flex>
                                                    </Flex>
                                                </Block>
                                            );
                                        })}
                                    </Tab>
                                    <Tab location="Credits">
                                        {testSettings(2).map((_, index) => {
                                            return (
                                                <Block
                                                    style={{
                                                        border: '0.1vh solid white',
                                                        'background-color': 'rgba(0, 0, 0, 0.3)',
                                                        width: '100%',
                                                        height: '8vh',
                                                        margin: '0.7vh 0',
                                                    }}
                                                >
                                                    <Flex
                                                        justify-content="space-between"
                                                        align-items="center"
                                                        style={{ height: '100%', 'padding-left': '1vh' }}
                                                    >
                                                        Setting Item
                                                        <Flex align-items="center" style={{ height: '100%' }}>
                                                            <Block
                                                                style={{
                                                                    height: '70%',
                                                                    width: '18vh',
                                                                    'background-color': 'black',
                                                                    border: '0.2vh solid white',
                                                                }}
                                                            ></Block>
                                                            <Block
                                                                style={{
                                                                    height: '70%',
                                                                    width: '18vh',
                                                                    'background-color': 'black',
                                                                    border: '0.2vh solid white',
                                                                    margin: '0 2vh',
                                                                }}
                                                            ></Block>
                                                        </Flex>
                                                    </Flex>
                                                </Block>
                                            );
                                        })}
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
