import { ParentComponent } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import useBaseComponent from '@components/BaseComponent/BaseComponent';
import style from '../ImageBase/ImageBase.module.scss';

export interface ImageProps extends ComponentProps {
    src: string | ImageMetadata
    fill?: boolean
}

const Image: ParentComponent<ImageProps> = (props) => {
    props.componentClasses = () => props.fill ? style.fill : "";
    const {className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    return <img src={props.src as string} 
                ref={props.ref as HTMLImageElement}
                class={`${className()}`}
                style={inlineStyles()}
                use:forwardEvents={props}
                use:forwardAttrs={props} />
}

export default Image;