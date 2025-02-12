import { ParentComponent } from "solid-js";
import styles from './BackgroundImage.module.css';
import ImageBase, { getImageBaseClasses, ImageBaseProps } from "../ImageBase/ImageBase";

export interface BackgroundImageProps extends ImageBaseProps { }

const BackgroundImage: ParentComponent<BackgroundImageProps> = (props) => {
    props.componentStyles = { "background-image": `url(${props.src})` };
    props.componentClasses = getImageBaseClasses({ props, styles, classPrefix: 'BackgroundImage', stylePrefix: 'background' });

    return <ImageBase {...props} />
}

export default BackgroundImage;