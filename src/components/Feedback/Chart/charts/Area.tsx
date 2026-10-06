import { createTokenComponent } from '@components/utils/tokenComponents';
import styles from '../Chart.module.scss';
import { AreaFillTokenProps, createSeriesChart, PointTokenProps, SeriesChartProps, StrokeTokenProps } from './SeriesChart';

export type AreaStrokeTokenProps = StrokeTokenProps;
export type AreaPointTokenProps = PointTokenProps;
export type { AreaFillTokenProps };

export const Fill = createTokenComponent<AreaFillTokenProps>();
export const Stroke = createTokenComponent<AreaStrokeTokenProps>();
export const Point = createTokenComponent<AreaPointTokenProps>();

export type AreaProps = SeriesChartProps;

const AreaChart = createSeriesChart({
    componentClass: styles.area,
    displayName: 'Chart.Area',
    mode: 'area',
    strokeTokenizer: Stroke,
    pointTokenizer: Point,
    fillTokenizer: Fill,
});

export default Object.assign(AreaChart, { Fill, Stroke, Point });
