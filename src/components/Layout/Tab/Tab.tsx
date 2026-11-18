import { children, ParentComponent, Show, untrack, useContext } from 'solid-js';
import { ComponentBaseProps } from '../../types/ComponentProps';
import { TabsContext } from '../Tabs/Tabs';

interface TabProps extends ComponentBaseProps {
    location: string;
    KeepInMemory?: boolean;
}

const Tab: ParentComponent<TabProps> = (props) => {
    const tabs = useContext(TabsContext);

    if (!tabs) {
        throw new Error('Tab must be used within a <Tabs> component');
    }

    // Chosen once at creation, as in 1.x.
    if (untrack(() => props.KeepInMemory)) {
        let resolved = children(() => props.children);
        // eslint-disable-next-line solid/components-return-once -- KeepInMemory is chosen once, as in 1.x
        return (
            <Show when={props.location === tabs.current()}>
                <>{resolved()}</>
            </Show>
        );
    }

    return (
        <Show when={props.location === tabs.current()}>
            <>{props.children}</>
        </Show>
    );
};

export default Tab;
