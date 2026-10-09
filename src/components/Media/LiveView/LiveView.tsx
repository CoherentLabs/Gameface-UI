import { ParentComponent } from "solid-js";
import baseComponent from "@components/BaseComponent/BaseComponent";
import type { ImageProps } from "../shared/types";
import styles from '../shared/shared.module.scss';

const LiveView: ParentComponent<ImageProps> = (props) => {
    props.componentClasses = () => props.fill ? styles.fill : "";

    return <img
        ref={props.ref as HTMLImageElement}
        src={props.src as string}
        use:baseComponent={props}
    />
}

export default LiveView;
