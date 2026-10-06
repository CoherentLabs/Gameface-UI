import { createTokenComponent } from '@components/utils/tokenComponents';
import styles from '../Chart.module.scss';
import { createRadialChart, HoleTokenProps, RadialChartProps, SliceTokenProps } from './RadialChart';

export type DonutSliceTokenProps = SliceTokenProps;
export type DonutHoleTokenProps = HoleTokenProps;

export const Slice = createTokenComponent<DonutSliceTokenProps>();

/**
 * The centre region. Its children replace the hole's content entirely; leave it
 * empty to style the container while `Chart.Labels placement="hole"` fills it.
 */
export const Hole = createTokenComponent<DonutHoleTokenProps>();

export type DonutProps = RadialChartProps;

const DEFAULT_INNER_RADIUS = '60%';

const DonutChart = createRadialChart({
    componentClass: styles.donut,
    displayName: 'Chart.Donut',
    sliceTokenizer: Slice,
    holeTokenizer: Hole,
    defaultInnerRadius: DEFAULT_INNER_RADIUS,
});

export default Object.assign(DonutChart, { Slice, Hole });
