import { ParentComponent } from "solid-js";
import { ImageComponentProps } from "../shared/types";
import useImageOptions from "../shared/useImageOptions";
import baseComponent from "@components/BaseComponent/BaseComponent";
import styles from '../shared/shared.module.scss';


const MaskImage: ParentComponent<ImageComponentProps> = (props) => {
  const maskStyles = useImageOptions('mask', props);

  props.componentClasses = () => {
    const base = props.fill ? `${styles['mask-image']} ${styles.fill}` : styles['mask-image'];
    return `${base} ${maskStyles().cls}`;
  };
  props.componentStyles = () => maskStyles().s;

  return (
    <div
      ref={props.ref as HTMLDivElement}
      use:baseComponent={props}>
        {props.children}
    </div>
  )
}

export default MaskImage;