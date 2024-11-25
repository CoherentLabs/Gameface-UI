import { ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import styles from './Layout.module.css'
import LayoutBaseProps from "../../types/LayoutBase";

const Layout: ParentComponent<LayoutBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.Layout} />
}

export default Layout