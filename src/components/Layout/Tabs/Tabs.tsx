import { Accessor, onMount, ParentComponent } from "solid-js";
import { createContext, createSignal } from "solid-js";

export const TabsContext = createContext<TabsContextValue>();

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
    onBeforeTabChange?: (currentLocation?: string) => Promise<void> | void;
    onTabChanged?: (newLocation?: string) => Promise<void> | void;
}

const Tabs: ParentComponent<TabsProps> = (props) => {
    const [current, setCurrent] = createSignal(props.default ?? '');

    const changeTab = async (newLocation: string) => {
        await onBeforeTabChangeHandler()
        setCurrent(newLocation)
        await onTabChangedHandler()
    }

    const onBeforeTabChangeHandler = async () => {
        if (props.onBeforeTabChange) await props.onBeforeTabChange(current());
    }

    const onTabChangedHandler = async () => {
        if (props.onTabChanged) await props.onTabChanged(current());
    }

    const tabsRefObject: TabsComponentRef = {
        changeTab,
    };

    onMount(() => {
        if (props.ref) {
            (props.ref as (ref: any) => void)(tabsRefObject);
        }
      });

    return (
        <TabsContext.Provider value={{ current, changeTab }}>
            {props.children}
        </TabsContext.Provider>
    );
}

export default Tabs