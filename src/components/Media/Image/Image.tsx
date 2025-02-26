import { ParentComponent } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import { BaseComponent } from "../../BaseComponent/BaseComponent";

export interface ImageProps extends ComponentProps {
    src: string
}

const Image: ParentComponent<ImageProps> = (props) => {
    const { eventHandlers, ...rest } = BaseComponent(props);

    return <img src={props.src} ref={props.ref as HTMLImageElement} {...rest} />
}

export default Image;