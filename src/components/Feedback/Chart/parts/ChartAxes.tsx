import { Component, For, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import styles from '../Chart.module.scss';
import { AxisTokenProps, GridTokenProps } from '../slots';
import { ChartMargin } from '../types';

export interface AxisTick {
    /** Plot-local pixels along the axis. */
    position: number;
    label: string;
}

interface AxisGeometry {
    margin: ChartMargin;
    plotWidth: number;
    plotHeight: number;
    /** Ticks along the value axis, on its own pixel scale. */
    valueTicks: AxisTick[];
    /** One per category, already centred on its band. */
    categoryTicks: AxisTick[];
    horizontal: boolean;
    valueAxis?: AxisTokenProps | null;
    categoryAxis?: AxisTokenProps | null;
}

/**
 * The value axis runs bottom-to-top for vertical bars and left-to-right for
 * horizontal ones, so a value tick becomes a horizontal or a vertical line
 * depending on orientation. Category ticks are the other way round.
 */
const valueLine = (geometry: AxisGeometry, position: number) => (geometry.horizontal
    ? { x1: position, y1: 0, x2: position, y2: geometry.plotHeight }
    : { x1: 0, y1: position, x2: geometry.plotWidth, y2: position });

const categoryLine = (geometry: AxisGeometry, position: number) => (geometry.horizontal
    ? { x1: 0, y1: position, x2: geometry.plotWidth, y2: position }
    : { x1: position, y1: 0, x2: position, y2: geometry.plotHeight });

export interface ChartGridLinesProps extends AxisGeometry {
    grid?: GridTokenProps | null;
    /** Pixel position of the zero baseline along the value axis. */
    baseline: number;
}

/** SVG half of the axes: gridlines and the zero baseline. Goes inside the `<svg>`. */
export const ChartGridLines: Component<ChartGridLinesProps> = (props) => {
    const gridClasses = () => [styles.gridline, props.grid?.class];
    const showHorizontal = () => props.grid && props.grid.horizontal !== false;
    const showVertical = () => props.grid?.vertical === true;
    const showBaseline = () => !!props.valueAxis && !props.valueAxis.hide && props.valueAxis.line !== false;

    return (
        <g transform={`translate(${props.margin.left} ${props.margin.top})`}>
            <Show when={showHorizontal()}>
                <For each={props.valueTicks} keyed={false}>{(tick) => (
                    <line {...valueLine(props, tick().position)} class={gridClasses()} style={props.grid?.style} />
                )}</For>
            </Show>

            <Show when={showVertical()}>
                <For each={props.categoryTicks} keyed={false}>{(tick) => (
                    <line {...categoryLine(props, tick().position)} class={gridClasses()} style={props.grid?.style} />
                )}</For>
            </Show>

            {/* Drawn last so the baseline reads above the grid. */}
            <Show when={showBaseline()}>
                <line {...valueLine(props, props.baseline)} class={styles.baseline} />
            </Show>
        </g>
    );
};

/** HTML half of the axes: the tick labels. Goes inside the plot container. */
export const ChartAxisLabels: Component<AxisGeometry> = (props) => {
    const valueLabelStyle = (position: number): JSX.CSSProperties => (props.horizontal
        ? { left: `${props.margin.left + position}px`, top: `${props.margin.top + props.plotHeight}px`, transform: 'translate(-50%, 0)' }
        : { left: `${props.margin.left}px`, top: `${props.margin.top + position}px`, transform: 'translate(-100%, -50%)' });

    const categoryLabelStyle = (position: number): JSX.CSSProperties => (props.horizontal
        ? { left: `${props.margin.left}px`, top: `${props.margin.top + position}px`, transform: 'translate(-100%, -50%)' }
        : { left: `${props.margin.left + position}px`, top: `${props.margin.top + props.plotHeight}px`, transform: 'translate(-50%, 0)' });

    return (
        <div class={styles.labels}>
            <Show when={props.valueAxis && !props.valueAxis.hide}>
                <For each={props.valueTicks} keyed={false}>{(tick) => (
                    <div
                        class={[styles['axis-label'], props.valueAxis?.class]}
                        style={{ ...valueLabelStyle(tick().position), ...props.valueAxis?.style }}
                    >
                        {tick().label}
                    </div>
                )}</For>
            </Show>

            <Show when={props.categoryAxis && !props.categoryAxis.hide}>
                <For each={props.categoryTicks} keyed={false}>{(tick) => (
                    <div
                        class={[styles['axis-label'], props.categoryAxis?.class]}
                        style={{ ...categoryLabelStyle(tick().position), ...props.categoryAxis?.style }}
                    >
                        {tick().label}
                    </div>
                )}</For>
            </Show>
        </div>
    );
};
