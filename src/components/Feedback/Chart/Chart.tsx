import { ParentComponent } from 'solid-js';
import Pie from './charts/Pie';
import Donut from './charts/Donut';
import Bar from './charts/Bar';
import Line from './charts/Line';
import Area from './charts/Area';
import Spider from './charts/Spider';
import { Grid, Labels, Legend, Tooltip, XAxis, YAxis } from './slots';

export * from './types';
export { DEFAULT_PALETTE, LIGHT_PALETTE } from './core/palette';

const Chart: ParentComponent = () => <></>;

export default Object.assign(Chart, {
    Pie,
    Donut,
    Bar,
    Line,
    Area,
    Spider,
    Legend,
    Tooltip,
    Labels,
    XAxis,
    YAxis,
    Grid,
});
