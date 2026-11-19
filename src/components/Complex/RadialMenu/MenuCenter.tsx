import { ParentComponent, useContext } from "solid-js";
import { useToken } from "@components/utils/tokenComponents";
import { TokenComponentProps } from "@components/types/ComponentProps";
import { Content, RadialMenuContext } from "./RadialMenu";
import styles from './RadialMenu.module.scss';
import MenuIndicator from "./MenuIndicator";

export const MenuCenter: ParentComponent<TokenComponentProps> = (props) => {
    const contentToken = useToken(Content, () => props.parentChildren)
    const context = useContext(RadialMenuContext);
    if (!context) {
        console.error('RadialMenu.Content must be used inside a RadialMenu component');
        return null;
    }

    return (
        <div class={[styles['menu-content'], contentToken()?.class]} style={contentToken()?.style}>
            {/* Content JSX goes here */}
            {contentToken()?.children}
            {/* The indicator that points to the selected item */}
            <MenuIndicator parentChildren={props.parentChildren} />
        </div>
    )
}

export default MenuCenter;