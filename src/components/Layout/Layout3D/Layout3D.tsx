import { ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import styles from './Layout3D.module.scss'
import { ComponentBaseProps } from "../../types/ComponentProps";

interface Layout3DProps extends ComponentBaseProps {
    distance: string
}

const Layout3D: ParentComponent<Layout3DProps> = (props) => {
    return <LayoutBase componentStyles={{ perspective: `${props.distance}` }} {...props} class={[styles.layout3D, props.class]} />
}

export default Layout3D