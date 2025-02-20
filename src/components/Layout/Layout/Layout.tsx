import { ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import styles from './Layout.module.css'
import { ComponentBaseProps } from "../../types/ComponentProps";

const Layout: ParentComponent<ComponentBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.Layout} />
}

export default Layout