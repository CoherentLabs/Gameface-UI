import { ParentComponent } from "solid-js";
import Image, { ImageProps } from "../Image/Image";

export interface LiveViewProps extends ImageProps { }

const LiveView: ParentComponent<LiveViewProps> = (props) => {
    return <Image {...props} />
}

export default LiveView;