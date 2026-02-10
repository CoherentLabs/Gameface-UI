import { ParentComponent } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import style from '../ImageBase/ImageBase.module.scss';
import baseComponent from "@components/BaseComponent/BaseComponent";

export interface ImageProps extends ComponentProps {
    src: string | ImageMetadata
    fill?: boolean
}

const Image: ParentComponent<ImageProps> = (props) => {
    props.componentClasses = () => props.fill ? style.fill : "";

    return <img src={props.src as string}
        ref={props.ref as HTMLImageElement}
        use:baseComponent={props}
    />
}

export default Image;