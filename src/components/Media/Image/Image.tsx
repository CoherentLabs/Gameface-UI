import { ParentComponent } from "solid-js";
import baseComponent from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";
import type { ImageTree } from "./ImageTypes";
import { ImageComponentProps } from "../shared/types";
import useImageOptions from "../shared/useImageOptions";
import styles from '../shared/shared.module.scss';

const Image: ParentComponent<ImageComponentProps> = (props) => {
    const bgOptions = useImageOptions('background', props);

    // With options this is a background image, so it takes that base instead of
    // Image's own - no dimensions and no contain/center, exactly as BackgroundImage behaved
    const ownStyles = () => {
        if (props.options) return bgOptions().s;

        const src = String(props.src);
        const sprite = (window as any).__GF_ATLAS__?.[src.split('/').pop()!];

        return sprite
            ? { 'background-image': sprite.image, 'background-size': sprite.size, 'background-position': sprite.position }
            : { 'background-image': `url(${src})` };
    };

    return (
        <div
            class={[
                props.options ? styles['background-image'] : styles.image,
                props.fill && styles.fill,
                props.options && bgOptions().cls,
                props.class,
            ]}
            style={{ ...ownStyles(), ...props.style }}
            ref={[exposeRef(props), baseComponent(props)]}>
            {props.children}
        </div>
    )
};

export default Image as typeof Image & ImageTree;
