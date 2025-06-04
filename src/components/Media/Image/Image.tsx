import { ParentComponent } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import useBaseComponent from '@components/BaseComponent/BaseComponent';

export interface ImageProps extends ComponentProps {
    src: string | ImageMetadata
}

const Image: ParentComponent<ImageProps> = (props) => {
    const {className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    return <img src={props.src as string} 
                ref={props.ref as HTMLImageElement}
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props}
                use:forwardAttrs={props} />
}

export default Image;