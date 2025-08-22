import Flex from "@components/Layout/Flex/Flex";
import { createMemo, ParentComponent, useContext } from "solid-js";
import style from './SidePanel.module.scss'
import { MenuContext, OPTIONS } from "../../../views/menu/Menu";
import { gameplayPanelContent } from "./gameplayPanelContent";
import { graphicsPanelContent } from "./graphicsPanelContent";

interface SidePanelProps {
    option: string,
}

const getContent = (active: string) => {
    switch (active) {
        case OPTIONS[0]:
            return gameplayPanelContent;
        case OPTIONS[1]:
            return graphicsPanelContent;
        default:
            return {};
    }
}

const SidePanel: ParentComponent<SidePanelProps> = (props) => {
    const context = useContext(MenuContext); 
    const content = createMemo(() => getContent(context?.activeTab() as string));

    return (
        <Flex class={`${style['side-panel']}`} direction="column" >
            <h3>{content()![props.option].title}</h3>
            <div class={style['side-panel-content']}>{content()![props.option].content}</div>
            <div class="extra-content"></div>
        </Flex>
    )
}

export default SidePanel