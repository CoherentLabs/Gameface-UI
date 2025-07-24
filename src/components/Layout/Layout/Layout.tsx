import { ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import styles from './Layout.module.scss'
import { ComponentBaseProps } from "../../types/ComponentProps";

const Layout: ParentComponent<ComponentBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.layout} />
}

export default Layout