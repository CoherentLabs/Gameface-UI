import { ParentComponent } from 'solid-js';
import { createTokenComponent } from '@components/utils/tokenComponents';
import styles from '../Chart.module.scss';
import { createRadialChart, RadialChartProps, SliceTokenProps } from './RadialChart';

export type PieSliceTokenProps = SliceTokenProps;

export const Slice = createTokenComponent<PieSliceTokenProps>();

/** A pie is a radial chart with no hole; use `Chart.Donut` for a ring. */
export type PieProps = Omit<RadialChartProps, 'innerRadius'>;

const PieChart = createRadialChart({
    componentClass: styles.pie,
    displayName: 'Chart.Pie',
    sliceTokenizer: Slice,
}) as ParentComponent<PieProps>;

export default Object.assign(PieChart, { Slice });
