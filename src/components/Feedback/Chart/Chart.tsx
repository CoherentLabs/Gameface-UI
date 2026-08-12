import { ParentComponent } from 'solid-js';
import Pie from './charts/Pie';
import Donut from './charts/Donut';
import { Labels, Legend, Tooltip } from './slots';

export * from './types';
export { DEFAULT_PALETTE, LIGHT_PALETTE } from './core/palette';

const Chart: ParentComponent = () => <></>;

export default Object.assign(Chart, {
    Pie,
    Donut,
    Legend,
    Tooltip,
    Labels,
});
