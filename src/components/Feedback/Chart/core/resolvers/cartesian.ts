import { ChartHit, ChartHitResolver } from '../../types';
import { BandScale } from '../scales';

export interface CartesianBar {
    seriesIndex: number;
    categoryIndex: number;
    /** Pixel rectangle of the mark, already in plot-local coordinates. */
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Resolves a pointer position over a bar chart.
 *
 * The category comes from the band scale in constant time. Which mark within
 * that category is then a short scan of that category's bars only — grouped
 * charts need the sub-band, stacked charts need the segment under the pointer,
 * and both are cheapest to answer from the rectangles we already computed.
 */
export interface SeriesVertex {
    seriesIndex: number;
    categoryIndex: number;
    /** Plot-local pixels, already including the margin. */
    x: number;
    y: number;
}

/**
 * Resolves a pointer position over a line or area chart by nearest vertex.
 *
 * This is why line and area default to the overlay mode rather than native SVG
 * hit-testing: a 2px stroke is effectively unhoverable, and the interaction
 * people expect is "tell me about the point I am nearest to", which no amount
 * of per-element hit-testing provides.
 *
 * The category is picked by x alone so the pointer can sit well above or below
 * the line and still resolve; only then is the series chosen by vertical
 * distance.
 */
export const createNearestVertexResolver = (
    vertices: () => SeriesVertex[],
    bounds: () => { left: number; right: number; top: number; bottom: number } | null,
): ChartHitResolver => (x, y) => {
    const box = bounds();
    if (!box || x < box.left || x > box.right || y < box.top || y > box.bottom) return null;

    const points = vertices();
    if (points.length === 0) return null;

    let nearestX = Infinity;
    for (let i = 0; i < points.length; i++) {
        const distance = Math.abs(points[i].x - x);
        if (distance < nearestX) nearestX = distance;
    }

    // Everything sharing that x is a candidate; the closest vertically wins.
    let best: SeriesVertex | null = null;
    let bestGap = Infinity;

    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        if (Math.abs(point.x - x) > nearestX + 0.5) continue;

        const gap = Math.abs(point.y - y);
        if (gap < bestGap) {
            bestGap = gap;
            best = point;
        }
    }

    if (!best) return null;

    const hit: ChartHit = {
        seriesIndex: best.seriesIndex,
        pointIndex: best.categoryIndex,
        position: { x: best.x, y: best.y },
    };

    return hit;
};

export const createBarResolver = (
    categoryScale: () => BandScale | null,
    bars: () => CartesianBar[],
    horizontal: () => boolean,
): ChartHitResolver => (x, y) => {
    const scale = categoryScale();
    if (!scale) return null;

    // The band runs along x for vertical bars and along y for horizontal ones.
    const categoryIndex = scale.indexAt(horizontal() ? y : x);
    if (categoryIndex < 0) return null;

    const candidates = bars();

    for (let i = 0; i < candidates.length; i++) {
        const bar = candidates[i];
        if (bar.categoryIndex !== categoryIndex) continue;

        if (x < bar.x || x > bar.x + bar.width) continue;
        if (y < bar.y || y > bar.y + bar.height) continue;

        const hit: ChartHit = {
            seriesIndex: bar.seriesIndex,
            pointIndex: bar.categoryIndex,
            position: { x, y },
        };

        return hit;
    }

    return null;
};
