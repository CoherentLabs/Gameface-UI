import { ParentComponent } from "solid-js";
import { ImageComponentProps } from "../shared/types";
import useImageOptions from "../shared/useImageOptions";
import baseComponent from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";
import styles from '../shared/shared.module.scss';


const MaskImage: ParentComponent<ImageComponentProps> = (props) => {
  const maskStyles = useImageOptions('mask', props);

  return (
    <div
      class={[styles['mask-image'], props.fill && styles.fill, maskStyles().cls, props.class]}
      style={{ ...maskStyles().s, ...props.style }}
      ref={[exposeRef(props), baseComponent(props)]}>
        {props.children}
    </div>
  )
}

export default MaskImage;
