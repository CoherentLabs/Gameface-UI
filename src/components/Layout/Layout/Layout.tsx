import { ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import styles from './Layout.module.scss'
import { ComponentBaseProps } from "../../types/ComponentProps";
import Top from "../Top/Top";
import Bottom from "../Bottom/Bottom";
import Content from "../Content/Content";

const Layout: ParentComponent<ComponentBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.layout} />
}

export default Object.assign(Layout, {Top, Bottom, Content})