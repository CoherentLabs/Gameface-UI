import { createMemo, mergeProps, ParentComponent } from "solid-js";
import styles from './BackgroundImage.module.scss';
import ImageBase, { ImageComponentProps } from "../ImageBase/ImageBase";

export interface BackgroundImageProps extends ImageComponentProps { }

const BackgroundImage: ParentComponent<BackgroundImageProps> = props => (
    <ImageBase
      {...props}
      styles={styles}
      classPrefix="background-image"
      stylePrefix="background"
    />
);

export default BackgroundImage;