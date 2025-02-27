import { onMount, ParentComponent } from 'solid-js';
import { ComponentProps } from '../../types/ComponentProps';
import { BaseComponent } from '../../BaseComponent/BaseComponent';

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
    'top left',
    'top center',
    'top right',
    'center left',
    'center right',
    'bottom left',
    'bottom center',
    'bottom right',
    'left',
    'right',
] as const;
type ImagePositions = (typeof imagePosition)[number] | (string & {});
const imagePositionSet = new Set(imagePosition);

type StylePrefixType = 'background' | 'mask';
type ClassPrefixType = 'BackgroundImage' | 'MaskImage';

interface GetImageBaseClassesArgs {
    imageClasses?: string;
    props: ImageBaseProps;
    styles: any;
    classPrefix: ClassPrefixType;
    stylePrefix: StylePrefixType;
}

type SetImageOptionStyle = (
    availableValues: Set<string>,
    value: ImageSizes | ImagePositions,
    style: 'size' | 'position',
    args: GetImageBaseClassesArgs
) => void;

/**
 * This function sets a predefined CSS class based on the prefix and option value, or assigns the value directly to the CSS styles property.
 * It first checks if the option value is valid within the provided availableValues set.
 * Currently, this function is used to set the position and size of an image (for the BackgroundImage or MaskImage components).
 * @param args
 */
const setImageOptionStyle: SetImageOptionStyle = (availableValues, value, style, args) => {
    const { props, styles, classPrefix, stylePrefix } = args;

    if (availableValues.has(value)) {
        args.imageClasses += ` ${styles[`${classPrefix}-${style}-${value}`]}`;
    } else if (props.componentStyles) {
        props.componentStyles[`${stylePrefix}-${style}`] = value;
    }
};

export const getImageBaseClasses = (args: GetImageBaseClassesArgs) => {
    const { styles, classPrefix, props } = args;
    args.imageClasses = `${styles[classPrefix]}`;
    if (!props.options) return args.imageClasses;

    const { size, position, repeat } = props.options;
    if (size) setImageOptionStyle(imageSizesSet, size, 'size', args);
    if (position) setImageOptionStyle(imagePositionSet, position, 'position', args);
    if (repeat && imageRepeatSet.has(repeat)) args.imageClasses += ` ${styles[`${classPrefix}-repeat-${repeat}`]}`;

    return args.imageClasses;
};

export interface ImageBaseOptions {
    size?: ImageSizes;
    repeat?: ImageRepeat;
    position?: ImagePositions;
}

export interface ImageBaseProps extends ComponentProps {
    src: string;
    options?: ImageBaseOptions;
}

const ImageBase: ParentComponent<ComponentProps> = (props) => {
    let element: HTMLDivElement | undefined;

    onMount(() => {
        if (props.ref && element) {
            (props.ref as (ref: any) => void)({
                ...props.refObject,
                element,
            });
        }
    });

    return (
        <div ref={element} 
            {...BaseComponent(props).eventHandlers} 
            class={BaseComponent(props).className}
            style={BaseComponent(props).style}>
            {props.children}
        </div>
    );
};

export default ImageBase;
