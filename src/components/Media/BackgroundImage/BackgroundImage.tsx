import { createMemo, mergeProps, ParentComponent } from "solid-js";
import styles from './BackgroundImage.module.css';
import ImageBase, { ImageComponentProps } from "../ImageBase/ImageBase";

export interface BackgroundImageProps extends ImageComponentProps { }

const BackgroundImage: ParentComponent<BackgroundImageProps> = props => (
    <ImageBase
      {...props}
      styles={styles}
      classPrefix="BackgroundImage"
      stylePrefix="background"
    />
);

export default BackgroundImage;