import { ChartHit, ChartPoint, ChartPointEvent, ChartSeries } from '../types';

/**
 * Turns a hit into the public event.
 *
 * `pointIndex` indexes the normalised category list, not the series' own
 * `points` array — a series may declare its points in any order, or omit a
 * category entirely, in which case the point is reported with a value of 0.
 */
export const createPointEvent = (
    series: ChartSeries[],
    categories: string[],
    hit: ChartHit,
): ChartPointEvent | null => {
    const entry = series[hit.seriesIndex];
    const category = categories[hit.pointIndex];
    if (!entry || category === undefined) return null;

    const fallback: ChartPoint = { type: category, value: 0 };
    const point = entry.points?.find(candidate => candidate.type === category) ?? fallback;

    return {
        point,
        series: entry,
        seriesIndex: hit.seriesIndex,
        pointIndex: hit.pointIndex,
        position: hit.position,
    };
};
