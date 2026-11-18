import { onSettled, ParentComponent, untrack } from "solid-js";
import { createContext, createSignal } from "solid-js";

// `null` default: Tab / TabLink report their own error outside Tabs (pattern 1.3.o).
export const TabsContext = createContext<TabsContextValue | null>(null);

type changeTabMethod = (newTab: string) => void;

export interface TabsComponentRef {
    changeTab: changeTabMethod;
}

interface TabsContextValue {
    current: () => string,
    changeTab: changeTabMethod;
}

interface TabsProps {
    default?: string;
    ref?: unknown | ((ref: TabsComponentRef) => void);
    onBeforeTabChange?: (currentLocation: string, newLocation: string) =>  Promise<void | boolean> | void | boolean;
    onTabChanged?: (newLocation: string) => Promise<void> | void;
}

const Tabs: ParentComponent<TabsProps> = (props) => {
    const [current, setCurrent] = createSignal(untrack(() => props.default ?? ''));

    const changeTab = async (newLocation: string) => {
        const response = await onBeforeTabChangeHandler(current(), newLocation)
        if (response === false) return;
        setCurrent(newLocation)
        await onTabChangedHandler()
    }

    const onBeforeTabChangeHandler = async (from: string, to: string): Promise<void | boolean> => {
        if (props.onBeforeTabChange) return await props.onBeforeTabChange(from, to);
    }

    const onTabChangedHandler = async () => {
        if (props.onTabChanged) await props.onTabChanged(current());
    }

    const tabsRefObject: TabsComponentRef = {
        changeTab,
    };

    // Tabs renders no element of its own, so the ref gets only the API.
    // onSettled (not setup) so a ref callback may write signals.
    onSettled(() => {
        if (typeof props.ref === 'function') props.ref(tabsRefObject);
    });

    return (
        <TabsContext value={{ current, changeTab }}>
            {props.children}
        </TabsContext>
    );
}

export default Tabs