import { ParentComponent, useContext } from "solid-js";
import { ComponentBaseProps } from "../../types/ComponentProps";
import { TabsContext } from "../Tabs/Tabs";
import LayoutBase from "../LayoutBase";


interface TabLinkProps extends ComponentBaseProps {
    location: string,
    activeClass: string
}

const TabLink: ParentComponent<TabLinkProps> = (props) => {
    const tabs = useContext(TabsContext);

    if (!tabs) {
        throw new Error("TabLink must be used within a <Tabs> component");
    }

    const handleTabChange = async (event: MouseEvent) => {
        props.click && props.click(event);
        tabs.changeTab(props.location);
    };
  
    return (
        <LayoutBase {...props} click={handleTabChange} active={() => props.location === tabs.current() ? props.activeClass : ''}>
            {props.children}
        </LayoutBase>
    );
}

export default TabLink;