
import { createMemo } from 'solid-js';
import { imagePosition, ImagePositions, ImageComponentProps, imageRepeat, ImageSizes, imageSizes } from './types';
import styles from './shared.module.scss';

type PrefixType = 'background' | 'mask';

/** The classes and inline styles for one image, filled in as the options are read. */
interface ImageOptionStyles {
    cls: string[];
    s: Record<string, any>;
    prefix: PrefixType,
    classPrefix: string
}

type SetImageOptionStyle = (
    availableValues: Set<string>,
    value: ImageSizes | ImagePositions,
    style: 'size' | 'position',
    args: ImageOptionStyles
) => void;

const imageSizesSet = new Set(imageSizes);
const imageRepeatSet = new Set(imageRepeat);
const imagePositionSet = new Set(imagePosition);

/**
 * This function sets a predefined CSS class based on the prefix and option value, or assigns the value directly to the CSS styles property.
 * It first checks if the option value is valid within the provided availableValues set.
 * Currently, this function is used to set the position and size of an image (for the Image or MaskImage components).
 * @param args
 */
const setImageOptionStyle: SetImageOptionStyle = (availableValues, value, style, args) => {
    const { cls, s, prefix, classPrefix } = args;

    if (availableValues.has(value)) {
        cls.push(`${styles[`${classPrefix}-${style}-${value}`]}`);
    } else {
        s[`${prefix}-${style}`] = value;
    }
};

const useImageOptions = (prefix: PrefixType, props: ImageComponentProps) => {
    return createMemo(() => {
        const classPrefix = `${prefix}-image`;
        const cls: string[] = []
        // background/mask-image: url(src)
        const s = {[`${prefix}-image`]: `url(${props.src})`};
        const args = { cls, s, prefix, classPrefix }
    
        if (props.options) {
            const { size, position, repeat } = props.options;
            if (size) setImageOptionStyle(imageSizesSet, size, 'size', args);
            if (position) setImageOptionStyle(imagePositionSet, position, 'position', args);
            if (repeat && imageRepeatSet.has(repeat)) cls.push(`${styles[`${classPrefix}-repeat-${repeat}`]}`);
        }
        
        return { cls: cls.join(' '), s }
    })
};

export default useImageOptions;