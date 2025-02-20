import { children, ParentComponent, Show, useContext } from 'solid-js';
import { ComponentBaseProps } from '../../types/ComponentProps';
import { TabsContext } from '../Tabs/Tabs';
import LayoutBase from '../LayoutBase';

interface TabProps extends ComponentBaseProps {
    location: string;
    KeepInMemory?: boolean;
}

const Tab: ParentComponent<TabProps> = (props) => {
    const tabs = useContext(TabsContext);

    if (!tabs) {
        throw new Error('Tab must be used within a <Tabs> component');
    }

    if (props.KeepInMemory) {
        let resolved = children(() => props.children);
        return (
            <Show when={props.location === tabs.current()}>
                <LayoutBase {...props}>{resolved()}</LayoutBase>
            </Show>
        );
    }

    return (
        <Show when={props.location === tabs.current()}>
            <LayoutBase {...props}>{props.children}</LayoutBase>
        </Show>
    );
};

export default Tab;
