import { ParentComponent, useContext } from "solid-js";
import { ComponentBaseProps } from "../../types/ComponentProps";
import { TabsContext } from "../Tabs/Tabs";
import LayoutBase from "../LayoutBase";


interface TabLinkProps extends ComponentBaseProps {
    location: string
}

const TabLink: ParentComponent<TabLinkProps> = (props) => {
    const tabs = useContext(TabsContext);

    if (!tabs) {
        throw new Error("TabLink must be used within a <Tabs> component");
    }

    const handleTabChange = async (event: MouseEvent) => {
        await tabs.onBeforeTabChangeHandler(tabs.current())
        props.click && props.click(event);
        tabs.setCurrent(props.location);
        await tabs.onTabChangedHandler(tabs.current())
    };
  
    return (
        <LayoutBase {...props} click={handleTabChange}>
            {props.children}
        </LayoutBase>
    );
}

export default TabLink;