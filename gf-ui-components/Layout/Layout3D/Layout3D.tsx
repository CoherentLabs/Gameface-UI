import { createEffect, createSignal, ParentComponent } from "solid-js";
import LayoutBase, { LayoutBaseRef } from "../LayoutBase";
import styles from './Layout3D.module.css'
import LayoutBaseProps from "../../types/LayoutBase";

export interface Layout3DRef extends LayoutBaseRef {
    distance: string
}

interface Layout3DProps extends LayoutBaseProps {
    distance: string
}

const Layout3D: ParentComponent<Layout3DProps> = (props) => {
    const layout3dObjectRef: Layout3DRef = {
        element: undefined,
        distance: props.distance
    }

    return <LayoutBase componentStyles={{perspective: `${props.distance}`}} {...props} componentClasses={styles.Layout3D} refObject={layout3dObjectRef} />
}

export default Layout3D