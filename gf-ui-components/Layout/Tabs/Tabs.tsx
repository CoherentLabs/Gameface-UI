import { Accessor, onMount, ParentComponent } from "solid-js";
import { createContext, createSignal } from "solid-js";

export const TabsContext = createContext<TabsContextValue>();

export interface TabsComponentRef {
    changeTab: (newTab: string) => void;
}

interface TabsContextValue {
    current: () => string,
    setCurrent: (args: string) => void,
    onBeforeTabChangeHandler: (currentLocation?: string) => void,
    onTabChangedHandler: (newLocation?: string) => void;
}

interface TabsProps {
    default?: string;
    ref?: unknown | ((ref: TabsComponentRef) => void);
    onBeforeTabChange?: (currentLocation?: string) => void;
    onTabChanged?: (newLocation?: string) => void;
}

const Tabs: ParentComponent<TabsProps> = (props) => {
    const [current, setCurrent] = createSignal(props.default ?? '');

    const changeTab = (newLocation: string) => {
        onBeforeTabChangeHandler()
        setCurrent(newLocation)
        onTabChangedHandler()
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
        <TabsContext.Provider value={{ current, setCurrent, onBeforeTabChangeHandler, onTabChangedHandler }}>
            {props.children}
        </TabsContext.Provider>
    );
}

export default Tabs