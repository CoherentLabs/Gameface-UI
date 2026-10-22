import { Accessor, Component, JSX } from 'solid-js';

export type VirtualMode = 'recycle' | 'unmount' | 'append';
export type VirtualAlign = 'start' | 'center' | 'stretch';
export type VirtualScrollAlign = 'start' | 'center' | 'end' | 'nearest';
export type VirtualDirection = 'up' | 'down' | 'left' | 'right';

/** Number = px, string = any CSS length ('10vmin', '5rem', ...) */
export type VirtualLength = number | string;

/** Half-open index range: `start` included, `end` excluded */
export interface VirtualRange {
    start: number;
    end: number;
}

export interface VirtualItemProps<T> {
    /** Reactive - in recycle mode the same component shows different items over time */
    item: T;
    /** Reactive */
    index: number;
    /** True while this item has navigation focus */
    focused: boolean;
}

export type VirtualItemComponent<T> = Component<VirtualItemProps<T>>;

export interface VirtualizationOptions<T> {
    items: T[] | Accessor<T[]>;
    component: VirtualItemComponent<T>;
    itemHeight: VirtualLength;
    /** Enables the grid layout */
    itemWidth?: VirtualLength;
    gap?: VirtualLength;
    align?: VirtualAlign;
    mode?: VirtualMode;
    /** Number = rows, string = CSS length. Defaults to a quarter of the viewport (min 1 row) */
    overscan?: VirtualLength;
    /** Rows loaded per batch in append mode */
    batchSize?: number;
    stickToEnd?: boolean;
    onEndReached?: () => void;
    /** Rows from the end that trigger onEndReached */
    endThreshold?: number;
    onRangeChange?: (range: VirtualRange) => void;
    /** Called when navigation is moved past the first/last row or column */
    onNavigationEdge?: (direction: VirtualDirection) => void;
}

export interface Virtualization<T> {
    readonly options: VirtualizationOptions<T>;
    scrollToIndex: (index: number, align?: VirtualScrollAlign) => void;
    /** Scrolls to a pixel offset from the top of the list */
    scrollToOffset: (offset: number) => void;
    scrollToItem: (predicate: (item: T, index: number) => boolean, align?: VirtualScrollAlign) => void;
    focusIndex: (index: number) => void;
    /** Fully visible items */
    visibleRange: Accessor<VirtualRange>;
    /** Items currently rendered (visible + overscan) */
    renderedRange: Accessor<VirtualRange>;
    focusedIndex: Accessor<number>;
    columns: Accessor<number>;
    remeasure: () => void;
}

export type VirtualRenderFunction<T> = (item: Accessor<T>, index: Accessor<number>) => JSX.Element;
