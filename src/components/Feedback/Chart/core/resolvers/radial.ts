import { ChartHit, ChartHitResolver } from '../../types';

export interface RadialSlice {
    seriesIndex: number;
    pointIndex: number;
    /** Radians, clockwise from 12 o'clock — the convention d3.pie() uses. */
    startAngle: number;
    endAngle: number;
    innerRadius: number;
    outerRadius: number;
}

const TAU = Math.PI * 2;

const normaliseAngle = (angle: number) => {
    const wrapped = angle % TAU;
    return wrapped < 0 ? wrapped + TAU : wrapped;
};

/**
 * Resolves a pointer position inside a pie, donut or spider chart.
 *
 * `atan2(dx, -dy)` measures clockwise from 12 o'clock, matching d3.pie().
 * Slice counts are small, so the angular scan is cheaper than maintaining a
 * cumulative array — and it allocates nothing per move.
 */
export const createRadialResolver = (
    centre: () => { x: number; y: number },
    slices: () => RadialSlice[],
): ChartHitResolver => (x, y) => {
    const { x: cx, y: cy } = centre();
    const dx = x - cx;
    const dy = y - cy;
    const radius = Math.sqrt(dx * dx + dy * dy);
    const angle = normaliseAngle(Math.atan2(dx, -dy));

    const candidates = slices();

    for (let i = 0; i < candidates.length; i++) {
        const slice = candidates[i];
        if (radius < slice.innerRadius || radius > slice.outerRadius) continue;

        const start = normaliseAngle(slice.startAngle);
        const sweep = slice.endAngle - slice.startAngle;
        if (sweep <= 0) continue;

        // A full circle contains every angle; otherwise measure the offset from
        // the slice start so a slice that wraps past 12 o'clock still matches.
        if (sweep >= TAU || normaliseAngle(angle - start) < sweep) {
            const hit: ChartHit = {
                seriesIndex: slice.seriesIndex,
                pointIndex: slice.pointIndex,
                position: { x, y },
            };

            return hit;
        }
    }

    return null;
};
