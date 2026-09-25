import { ComponentProps } from "@components/types/ComponentProps";

export const imageSizes = ['contain', 'cover'] as const;
export type ImageSizes = (typeof imageSizes)[number] | (string & {});

export const imageRepeat = ['both', 'x', 'y'] as const;
export type ImageRepeat = (typeof imageRepeat)[number];

export const imagePosition = [
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
export type ImagePositions = (typeof imagePosition)[number] | (string & {});

/** An image with nothing but a source - what `LiveView` renders straight onto an `img`. */
export interface ImageProps extends ComponentProps {
    src: string | ImageMetadata
    fill?: boolean
}

/** `ImageProps` plus the size/position/repeat options the div-based components accept. */
export interface ImageComponentProps extends ImageProps {
    options?: ImageOptions;
}

export interface ImageOptions {
    size?: ImageSizes;
    repeat?: ImageRepeat;
    position?: ImagePositions;
}