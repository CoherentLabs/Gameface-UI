import { ParentComponent } from "solid-js";
import type { ImageProps } from "../shared/types";

const LiveView: ParentComponent<ImageProps> = (props) => {
    return <img 
        ref={props.ref as HTMLImageElement}
        src={props.src as string} 
        class={props.class} 
        style={props.style}
    />
}

export default LiveView;