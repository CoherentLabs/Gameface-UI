import { ParentComponent } from "solid-js";
import styles from './MaskImage.module.css';
import ImageBase, { getImageBaseClasses, ImageBaseProps } from "../ImageBase/ImageBase";

export interface MaskImageProps extends ImageBaseProps { }

const Mask: ParentComponent<MaskImageProps> = (props) => {
    props.componentStyles = { "mask-image": `url(${props.src})` };
    props.componentClasses = getImageBaseClasses({ props, styles, classPrefix: 'MaskImage', stylePrefix: 'mask' });

    return <ImageBase {...props} />
}

export default Mask;