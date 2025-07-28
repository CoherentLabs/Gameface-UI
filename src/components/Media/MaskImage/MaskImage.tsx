import { ParentComponent } from "solid-js";
import styles from './MaskImage.module.scss';
import ImageBase, { ImageComponentProps } from "../ImageBase/ImageBase";

export interface MaskImageProps extends ImageComponentProps { }

const MaskImage: ParentComponent<MaskImageProps> = (props) => (
    <ImageBase
      {...props}
      styles={styles}
      classPrefix="mask-image"
      stylePrefix="mask"
    />
)

export default MaskImage;