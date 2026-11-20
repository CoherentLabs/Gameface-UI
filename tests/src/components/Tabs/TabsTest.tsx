import { createSignal, flush, For, onSettled } from "solid-js";
import Tabs, { TabsComponentRef } from "@components/Layout/Tabs/Tabs";
import Tab from "@components/Layout/Tab/Tab";
import TabLink from "@components/Layout/TabLink/TabLink";
import selectors from "../../../shared/tabs-selectors.json";
import createOnChangeLog from "../onChangeLog";

const LOCATIONS = ['one', 'two', 'three'];

// A Tabs of its own, nested in the e2e app's Tabs (each Tabs has its own context).
const TabsTest = () => {
    let tabsRef!: TabsComponentRef;
    const log = createOnChangeLog('tabs');
    const beforeLog = createOnChangeLog('tabs-before');
    const [blocked, setBlocked] = createSignal(false);

    const scenarios = [
        { label: "Change to two via ref", action: () => tabsRef.changeTab('two') },
        { label: "Change to two, then three", action: () => { tabsRef.changeTab('two'); tabsRef.changeTab('three'); } },
        { label: "Change to the current tab", action: () => tabsRef.changeTab('one') },
        { label: "Block changes", action: () => setBlocked(true) },
    ];

    const reset = async () => {
        setBlocked(false);
        flush();
        await tabsRef?.changeTab('one');
        flush();
        log.clear();
        beforeLog.clear();
    };

    onSettled(() => {
        document.addEventListener('reset', reset);
        return () => document.removeEventListener('reset', reset);
    });

    return (
        <div class={selectors.tabs}>
            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action}>
                        {sc.label}
                    </button>
                )}
            </For>

            <Tabs
                default="one"
                ref={(ref: TabsComponentRef) => (tabsRef = ref)}
                onBeforeTabChange={(from, to) => { beforeLog.record(from, to); return !blocked(); }}
                onTabChanged={(location) => log.record(location)}>
                <For each={LOCATIONS}>
                    {(location) => (
                        <TabLink location={location} class={`${selectors.tabLink} ${selectors.tabLink}-${location}`} activeClass={selectors.activeLink}>
                            {location}
                        </TabLink>
                    )}
                </For>
                <For each={LOCATIONS}>
                    {(location) => <Tab location={location}><div class={selectors.content}>{location}</div></Tab>}
                </For>
            </Tabs>
        </div>
    );
};

export default TabsTest;
