import { JSX } from 'solid-js';
import { ComponentProps } from '@components/types/ComponentProps';

/** A single data point. `type` is the category key and is the identity used to match points across data changes. */
export interface ChartPoint {
    type: string;
    value: number;
    /** Overrides the series colour. Primarily for pie/donut slices. */
    color?: string;
    /** Display text; defaults to `type`. */
    label?: string;
    /** Opaque payload forwarded to tooltip content and event callbacks. */
    meta?: Record<string, unknown>;
}

export interface ChartSeries {
    points: ChartPoint[];
    /** Stable identity across data changes. Defaults to the array index. */
    id?: string;
    /** Legend text. Defaults to `Series ${index + 1}`. */
    label?: string;
    /** Falls back to `palette[index % palette.length]`. */
    color?: string;
    class?: string;
    style?: JSX.CSSProperties;
}

export type ChartData = ChartSeries[];

export type ChartEasing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | ((t: number) => number);

export interface ChartAnimation {
    /** Milliseconds. Defaults to 300. `0` snaps to the target. */
    duration?: number;
    easing?: ChartEasing;
    /** Milliseconds before the tween starts. Defaults to 0. */
    delay?: number;
    /** Additional milliseconds of delay per mark index. Defaults to 0. */
    stagger?: number;
    onStart?: () => void;
    onEnd?: () => void;
}

/** `false`/absent disables interactivity entirely. `true` picks the mode best suited to the chart type. */
export type ChartInteractive = boolean | 'svg' | 'overlay';

export interface ChartPointEvent {
    point: ChartPoint;
    series: ChartSeries;
    seriesIndex: number;
    pointIndex: number;
    /** Pixel position within the chart root, used to place the tooltip. */
    position: { x: number; y: number };
}

export interface LegendEntry {
    label: string;
    color: string;
    seriesIndex: number;
    /**
     * Set when the entry stands for a single point rather than a whole series
     * — a pie legend lists slices, a bar legend lists series.
     */
    pointIndex?: number;
    visible: boolean;
}

export interface BaseChartProps extends ComponentProps {
    /** Reactive: reading a signal here re-renders and re-tweens the chart. */
    data: ChartSeries[];
    /** Overrides the built-in categorical palette. */
    palette?: string[];
    /** Absent means no animation. */
    animation?: ChartAnimation;
    /** Absent or `false` means no listeners are attached at all. */
    interactive?: ChartInteractive;
    onPointHover?: (event: ChartPointEvent | null) => void;
    onPointClick?: (event: ChartPointEvent) => void;
    onSeriesToggle?: (seriesIndex: number, visible: boolean) => void;
}

/** Identifies one mark. `seriesIndex` indexes the original `data` array, never the visible subset. */
export interface ChartHit {
    seriesIndex: number;
    pointIndex: number;
    position: { x: number; y: number };
}

/** Converts a pointer position in plot-local pixels into a hit, or `null` when the pointer is outside every mark. */
export type ChartHitResolver = (x: number, y: number) => ChartHit | null;

export interface ChartSize {
    width: number;
    height: number;
}

export interface ChartMargin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
