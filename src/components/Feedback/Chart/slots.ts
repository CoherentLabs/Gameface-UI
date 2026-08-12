import { JSX } from 'solid-js';
import { createTokenComponent, TokenBase } from '@components/utils/tokenComponents';
import { ChartPoint, ChartPointEvent, ChartSeries, LegendEntry } from './types';

export interface LegendTokenProps extends TokenBase {
    position?: 'top' | 'bottom' | 'left' | 'right';
    /** Clicking an entry toggles that series. Defaults to true when the slot is present. */
    interactive?: boolean;
    /** Replaces the markup of a single entry. Optional — the slot styles the default entries without it. */
    content?: (entry: LegendEntry) => JSX.Element;
}

export interface TooltipTokenProps extends TokenBase {
    /** Replaces the tooltip markup. Called with the hovered point. */
    content?: (event: ChartPointEvent) => JSX.Element;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
    /** Pixels between the pointer and the tooltip. Defaults to 12. */
    offset?: number;
}

export interface LabelsTokenProps extends TokenBase {
    placement?: 'inside' | 'outside' | 'hole';
    show?: 'always' | 'hover' | 'never';
    format?: (point: ChartPoint, series: ChartSeries) => string;
    /** Draws a connector from the slice to an outside label. */
    leaderLines?: boolean;
}

export interface AxisTokenProps extends TokenBase {
    /** A hint, not a guarantee — tick values are chosen for round numbers. */
    ticks?: number;
    format?: (value: number | string) => string;
    /** Draws the axis line itself. Defaults to true. */
    line?: boolean;
    hide?: boolean;
}

export interface GridTokenProps extends TokenBase {
    /** Lines across the value axis. Defaults to true. */
    horizontal?: boolean;
    /** Lines along the category axis. Defaults to false. */
    vertical?: boolean;
    ticks?: number;
}

export const Legend = createTokenComponent<LegendTokenProps>();
export const Tooltip = createTokenComponent<TooltipTokenProps>();
export const Labels = createTokenComponent<LabelsTokenProps>();
export const XAxis = createTokenComponent<AxisTokenProps>();
export const YAxis = createTokenComponent<AxisTokenProps>();
export const Grid = createTokenComponent<GridTokenProps>();
