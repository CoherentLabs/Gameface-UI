import { ParentComponent } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import styles from './Image.module.scss';
import baseComponent from "@components/BaseComponent/BaseComponent";
import type { ImageTree } from "./ImageTypes";

export interface ImageProps extends ComponentProps {
    src: string | ImageMetadata
    fill?: boolean
}

const Image: ParentComponent<ImageProps> = (props) => {
    props.componentClasses = () => props.fill ? `${styles.image} ${styles.fill}` : styles.image;

    props.componentStyles = () => {
        const src = String(props.src);
        const sprite = (window as any).__GF_ATLAS__?.[src.split('/').pop()!];

        return sprite
            ? { 'background-image': sprite.image, 'background-size': sprite.size, 'background-position': sprite.position }
            : { 'background-image': `url(${src})` };
    };

    return (
        <div 
            style={{"background-image": `url(${props.src})`}}
            ref={props.ref as HTMLDivElement}
            use:baseComponent={props}>
            {props.children}
        </div>
    )
};

export default Image as typeof Image & ImageTree;