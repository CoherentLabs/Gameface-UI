import { ParentComponent } from 'solid-js';
import { createTokenComponent } from '@components/utils/tokenComponents';
import styles from '../Chart.module.scss';
import { createSeriesChart, PointTokenProps, SeriesChartProps, StrokeTokenProps } from './SeriesChart';

export type LineStrokeTokenProps = StrokeTokenProps;
export type LinePointTokenProps = PointTokenProps;

export const Stroke = createTokenComponent<LineStrokeTokenProps>();
export const Point = createTokenComponent<LinePointTokenProps>();

/** Stacking only means something once there is a filled region to stack. */
export type LineProps = Omit<SeriesChartProps, 'stacked'>;

const LineChart = createSeriesChart({
    componentClass: styles.line,
    displayName: 'Chart.Line',
    mode: 'line',
    strokeTokenizer: Stroke,
    pointTokenizer: Point,
}) as ParentComponent<LineProps>;

export default Object.assign(LineChart, { Stroke, Point });
