import { ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import styles from './Layout3D.module.css'
import LayoutBaseProps from "../../types/LayoutBase";

interface Layout3DProps extends LayoutBaseProps {
    distance: string
}

const Layout3D: ParentComponent<Layout3DProps> = (props) => {
    return <LayoutBase componentStyles={{perspective: `${props.distance}`}} {...props} componentClasses={styles.Layout3D} />
}

export default Layout3D