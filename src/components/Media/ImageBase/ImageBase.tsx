import { createMemo, ParentComponent } from 'solid-js';
import { ComponentProps } from '../../types/ComponentProps';
import LayoutBase from '@components/Layout/LayoutBase';

const imageSizes = ['contain', 'cover'] as const;
// This type and the similar ones below are used when setting predefined strings as options for the image or any other string.
// The purpose of this is to enable better auto-complete with the available strings from the array.
type ImageSizes = (typeof imageSizes)[number] | (string & {});
const imageSizesSet = new Set(imageSizes);

const imageRepeat = ['both', 'x', 'y'] as const;
type ImageRepeat = (typeof imageRepeat)[number];
const imageRepeatSet = new Set(imageRepeat);

const imagePosition = [
    'top',
    'center',
    'bottom',
    'top-left',
    'top-center',
    'top-right',
    'center-left',
    'center-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
    'left',
    'right',
] as const;
type ImagePositions = (typeof imagePosition)[number] | (string & {});
const imagePositionSet = new Set(imagePosition);

type StylePrefixType = 'background' | 'mask';
type ClassPrefixType = 'BackgroundImage' | 'MaskImage';

interface GetImageBaseClassesArgs {
    props: ImageBaseProps;
    cls: { value: string };
    s: Record<string, any>;
}

type SetImageOptionStyle = (
    availableValues: Set<string>,
    value: ImageSizes | ImagePositions,
    style: 'size' | 'position',
    args: GetImageBaseClassesArgs
) => void;

export interface ImageBaseOptions {
    size?: ImageSizes;
    repeat?: ImageRepeat;
    position?: ImagePositions;
}

export interface ImageComponentProps extends ComponentProps {
    src: string | ImageMetadata;
    options?: ImageBaseOptions;
}

interface ImageBaseProps extends ImageComponentProps {
    styles: any;
    classPrefix: ClassPrefixType;
    stylePrefix: StylePrefixType;
}

/**
 * This function sets a predefined CSS class based on the prefix and option value, or assigns the value directly to the CSS styles property.
 * It first checks if the option value is valid within the provided availableValues set.
 * Currently, this function is used to set the position and size of an image (for the BackgroundImage or MaskImage components).
 * @param args
 */
const setImageOptionStyle: SetImageOptionStyle = (availableValues, value, style, args) => {
    const { props, cls, s } = args;

    if (availableValues.has(value)) {
        cls.value += ` ${props.styles[`${props.classPrefix}-${style}-${value}`]}`;
    } else {
        s[`${props.stylePrefix}-${style}`] = value;
    }
};


const ImageBase: ParentComponent<ImageBaseProps> = (props) => {
    const imageStyles = createMemo(() => {
        const cls = { value: `${props.styles[props.classPrefix]}` };
        const s = {[`${props.stylePrefix}-image`]: `url(${props.src})`};
        const args = { props, cls, s};

        if (props.options) {
            const { size, position, repeat } = props.options;
            if (size) setImageOptionStyle(imageSizesSet, size, 'size', args);
            if (position) setImageOptionStyle(imagePositionSet, position, 'position', args);
            if (repeat && imageRepeatSet.has(repeat)) cls.value += ` ${props.styles[`${props.classPrefix}-repeat-${repeat}`]}`;
        }

        return {cls, s};
    })


    return <LayoutBase {...props} componentClasses={imageStyles().cls.value} componentStyles={imageStyles().s} />
    
};

export default ImageBase;
