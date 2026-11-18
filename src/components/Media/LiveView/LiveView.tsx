import { ParentComponent } from "solid-js";
import baseComponent from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";
import type { ImageProps } from "../shared/types";
import styles from '../shared/shared.module.scss';

const LiveView: ParentComponent<ImageProps> = (props) => {
    return <img
        class={[props.fill && styles.fill, props.class]}
        style={props.style}
        src={props.src as string}
        ref={[exposeRef(props), baseComponent(props)]}
    />
}

export default LiveView;
