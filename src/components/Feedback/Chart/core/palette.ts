import { ChartPoint, ChartSeries } from '../types';

/**
 * Default categorical palette, stepped for a dark chart surface — game HUDs are
 * overwhelmingly dark or transparent.
 *
 * The slot ORDER is the colourblind-safety mechanism, not decoration. Validated
 * against surface #1a1a19: worst adjacent CVD dE 8.4, worst normal-vision dE
 * 19.3, all eight at or above 3:1 contrast. Reordering these or substituting
 * brand hues requires re-running the palette validator against both surfaces.
 */
export const DEFAULT_PALETTE = [
    '#3987e5', // blue
    '#d95926', // orange
    '#199e70', // aqua
    '#c98500', // yellow
    '#d55181', // magenta
    '#008300', // green
    '#9085e9', // violet
    '#e66767', // red
];

/**
 * The same eight hues stepped for a light surface (#fcfcfb). Aqua, yellow and
 * magenta fall below 3:1 contrast there, so charts on a light surface must ship
 * visible direct labels — which is why `Labels` defaults to `show="always"`.
 */
export const LIGHT_PALETTE = [
    '#2a78d6',
    '#eb6834',
    '#1baf7a',
    '#eda100',
    '#e87ba4',
    '#008300',
    '#4a3aa7',
    '#e34948',
];

let cycleWarned = false;

/**
 * Resolves a mark's colour.
 *
 * `seriesIndex` is the index in the original `data` array, never in the visible
 * subset, so hiding a series through the legend never repaints the survivors.
 */
export const resolveColor = (
    palette: string[],
    seriesIndex: number,
    series?: ChartSeries,
    point?: ChartPoint,
): string => {
    if (point?.color) return point.color;
    if (series?.color) return series.color;

    if (import.meta.env.DEV && seriesIndex >= palette.length && !cycleWarned) {
        cycleWarned = true;
        console.warn(
            `[Chart] More marks (${seriesIndex + 1}) than palette slots (${palette.length}). ` +
            'Colours now repeat and become ambiguous. Prefer fewer series, an "Other" bucket, ' +
            'or several smaller charts.',
        );
    }

    return palette[seriesIndex % palette.length];
};
