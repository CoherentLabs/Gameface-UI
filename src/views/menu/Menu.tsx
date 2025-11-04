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
import { Accessor, batch, createContext, createMemo, createSignal, For, JSX, onMount, Setter, Show } from 'solid-js';
import Gameplay from '@custom-components/Menu/Options/Gameplay/Gameplay';
import styles from './Menu.module.scss';
import { Column12, Column4, Column8 } from '@components/Layout/Column/Column';
import SidePanel from '@custom-components/Menu/SidePanel/SidePanel';
import Graphics from '@custom-components/Menu/Options/Graphics/Graphics';
import { getFirstOptionOfTab } from './util';
import Audio from '@custom-components/Menu/Options/Audio/Audio';
import Credits from '@custom-components/Menu/Options/Credits/Credits';
import CustomModal from '@custom-components/Menu/CustomModal/CustomModal';
import { ModalRef } from '@components/Feedback/Modal/Modal';
import eventBus from '@components/tools/EventBus';
import KeyBindsTab from '@custom-components/Menu/Options/KeyBindsTab/KeyBindsTab';
import useToast from '@components/Feedback/Toast/toast';
import Tutorial, { TutorialRef } from '@components/Complex/Tutorial/Tutorial';
import CustomToast from '@custom-components/Menu/CustomToast/CustomToast';
import CustomTooltip from '@custom-components/Menu/CustomTooltip/CustomTooltip';
import { TutorialSteps } from './util/tutorialSteps';

interface MenuContextValue {
    currentOption: Accessor<string>,
    setCurrentOption: Setter<string>,
    activeTab: Accessor<typeof OPTIONS[number]>,
    TutorialSteps: typeof TutorialSteps,
    interactiveTutorials: Accessor<{subtitles: boolean; color: boolean; }>
}

export const MenuContext = createContext<MenuContextValue>();
export const OPTIONS = ['Gameplay', 'Graphics', 'Keybinds', 'Audio', 'Credits'] as const;

const Menu = () => {
    let modalRef!: ModalRef;
    let tutorialRef: TutorialRef | undefined
    const [Toaster, createToast] = useToast();
    const [currentOption, setCurrentOption] = createSignal('difficulty');
    const [hasChanges, setHasChanges] = createSignal(false);
    const [activeTab, setActiveTab] = createSignal<typeof OPTIONS[number]>(OPTIONS[0]);
    const [interactiveTutorials, setInteractiveTutorials] = createSignal({ subtitles: false, color: false })
    let nextTab: string | undefined;
    let tabsRef!: TabsComponentRef;
    const MenuContextValue = {
        currentOption,
        setCurrentOption,
        activeTab,
        TutorialSteps,
        interactiveTutorials
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

    const showToast = () => {
        createToast({
            body: (close) => (
                <CustomToast close={close} action={() => tutorialRef?.tour()} />
            ),
            position: 'top-center',
        });
    };

    onMount(() => {
        eventBus.on('ui-change', () => setHasChanges(true))
        showToast();
    })

    const isCredits = createMemo(() => activeTab() === OPTIONS[4])

    const handleClick = () => {
        if (tutorialRef?.current() === TutorialSteps.Interactive.order) {
            if (interactiveTutorials().subtitles) return;

            tutorialRef.pause();
            const subtitlesToggle = document.getElementById('subtitles')
            subtitlesToggle?.addEventListener('click', () => {
                setInteractiveTutorials((prev) => ({...prev, subtitles: true}))
                tutorialRef.resume(true);
            }, { once: true });

            return;
        }

        if (tutorialRef?.current() === TutorialSteps.InteractiveTwo.order) {
            if (interactiveTutorials().color) return;

            tutorialRef.pause();
            const colorPicker = document.getElementById('subtitleColor')
            colorPicker?.addEventListener('mousedown', () => {
                setInteractiveTutorials((prev) => ({...prev, color: true}))
                setTimeout(() => tutorialRef.resume(true), 2000)
            }, { once: true });

            return;
        }
    }

    return (
        <MenuContext.Provider value={MenuContextValue}>
            <Tutorial click={handleClick} ref={tutorialRef} outset={5} tooltip={(props) => <CustomTooltip {...props} exit={() => tutorialRef?.exit()} />} >
                <Toaster /> 
                <Tutorial.Step title={TutorialSteps.End.title} content={TutorialSteps.End.content} order={TutorialSteps.End.order} outset={-10} position={"top"}>
                    <div class={styles.Menu}>
                        <Tabs ref={tabsRef} onBeforeTabChange={handleBeforeTabChange} onTabChanged={handleTabChange} default={OPTIONS[0]}>
                            <Layout>
                                <Tutorial.Step 
                                    order={TutorialSteps.Intro.order}
                                    content={TutorialSteps.Intro.content}
                                    title={TutorialSteps.Intro.title}
                                    outset={-5}>
                                    <Top class={styles.top}>
                                        <Flex>
                                            <h2 style={{ 'text-transform': 'uppercase' }}>Options</h2>
                                        </Flex>
                                        <Tutorial.Step order={TutorialSteps.Tabs.order} content={TutorialSteps.Tabs.content} title={TutorialSteps.Tabs.title}>
                                            <Flex direction='row'>
                                                <For each={OPTIONS}>
                                                    {(tab) => {
                                                        return <TabLink class={styles.link} location={tab} activeClass={styles.active}>
                                                            <Flex align-items="center" justify-content='center'>{tab}</Flex>
                                                        </TabLink>
                                                    }}
                                                </For>
                                            </Flex>
                                        </Tutorial.Step>
                                    </Top>
                                    <Content basis={70} class={styles.content}>
                                        <Tutorial.Step order={TutorialSteps.Structure.order} content={TutorialSteps.Structure.content} title={TutorialSteps.Structure.title} position="top">
                                            <Row>
                                                <Show when={!isCredits()}>
                                                    <Tutorial.Step order={TutorialSteps.Scroll.order} content={TutorialSteps.Scroll.content} title={TutorialSteps.Scroll.title} position='right'>
                                                        <Column8>
                                                            <Scroll style={{ width: '100%' }}>
                                                                <Scroll.Content class={styles['scroll-content']}>
                                                                    <Tab location={OPTIONS[0]}>
                                                                        <Gameplay />
                                                                    </Tab>
                                                                    <Tab location={OPTIONS[1]}>
                                                                        <Graphics />
                                                                    </Tab>
                                                                    <Tab location={OPTIONS[2]}>
                                                                        <KeyBindsTab />
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
                                                    </Tutorial.Step>
                                                    <Tutorial.Step 
                                                        order={TutorialSteps.InfoPanel.order} 
                                                        content={TutorialSteps.InfoPanel.content} 
                                                        title={TutorialSteps.InfoPanel.title}
                                                        position={'left'} >
                                                        <Column4>
                                                            <SidePanel option={currentOption()} />
                                                        </Column4>
                                                    </Tutorial.Step>
                                                </Show>
                                                <Show when={isCredits()}>
                                                    <Column12>
                                                        <Tab location={OPTIONS[4]}>
                                                            <Credits />
                                                        </Tab>
                                                    </Column12>
                                                </Show>
                                            </Row>
                                        </Tutorial.Step>
                                    </Content>
                                    <Bottom>
                                        <Show when={!isCredits()}>
                                            <Tutorial.Step order={TutorialSteps.Footer.order} content={TutorialSteps.Footer.content} title={TutorialSteps.Footer.title} outset={-15}>
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
                                            </Tutorial.Step>
                                        </Show>
                                    </Bottom>
                                </Tutorial.Step>
                            </Layout>
                        </Tabs>
                    </div>
                </Tutorial.Step> 
            </Tutorial>
            <CustomModal ref={modalRef} onClose={handleModalClose} />
        </MenuContext.Provider>
    );
};

export default Menu;
