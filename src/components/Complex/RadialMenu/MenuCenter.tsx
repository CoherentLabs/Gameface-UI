import { ParentComponent, createMemo, useContext } from "solid-js";
import { useToken } from "@components/utils/tokenComponents";
import { TokenComponentProps } from "@components/types/ComponentProps";
import { Content, RadialMenuContext } from "./RadialMenu";
import styles from './RadialMenu.module.scss';
import MenuIndicator from "./MenuIndicator";

export const MenuCenter: ParentComponent<TokenComponentProps> = (props) => {
    const contentToken = useToken(Content, props.parentChildren)
    const context = useContext(RadialMenuContext);
    if (!context) {
        console.error('RadialMenu.Content must be used inside a RadialMenu component');
        return null;
    }

    const menuCenterClasses = createMemo(() => {
        const classes = [styles['menu-content']];
        classes.push(contentToken()?.class ?? "");
        
        return classes.join(' ');
    });

    return (
        <div class={menuCenterClasses()} style={contentToken()?.style}>
            {/* Content JSX goes here */}
            {contentToken()?.children}
            {/* The indicator that points to the selected item */}
            <MenuIndicator parentChildren={props.parentChildren} />
        </div>
    )
}

export default MenuCenter;