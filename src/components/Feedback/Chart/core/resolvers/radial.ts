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

/** Shortest distance between two angles, ignoring which way round. */
const angularGap = (a: number, b: number) => {
    const gap = Math.abs(normaliseAngle(a) - normaliseAngle(b));
    return gap > Math.PI ? TAU - gap : gap;
};

export interface SpiderVertex {
    seriesIndex: number;
    categoryIndex: number;
    /** Radians, clockwise from 12 o'clock. */
    angle: number;
    /** Distance from the centre, in pixels. */
    radius: number;
}

/**
 * Resolves a pointer position over a spider chart.
 *
 * A spider series is one closed path spanning every category, so native SVG
 * hit-testing could only ever answer "which series" — never "which point".
 * Here the category comes from the nearest spoke by angle, and the series from
 * whichever vertex on that spoke is nearest the pointer's radius.
 */
export const createSpiderResolver = (
    centre: () => { x: number; y: number },
    vertices: () => SpiderVertex[],
    outerRadius: () => number,
): ChartHitResolver => (x, y) => {
    const { x: cx, y: cy } = centre();
    const dx = x - cx;
    const dy = y - cy;
    const radius = Math.sqrt(dx * dx + dy * dy);

    // A little slack past the outer ring keeps the outermost vertices hoverable.
    if (radius > outerRadius() + 8) return null;

    const points = vertices();
    if (points.length === 0) return null;

    const angle = normaliseAngle(Math.atan2(dx, -dy));

    let nearestAngle = Infinity;
    for (let i = 0; i < points.length; i++) {
        const gap = angularGap(points[i].angle, angle);
        if (gap < nearestAngle) nearestAngle = gap;
    }

    let best: SpiderVertex | null = null;
    let bestGap = Infinity;

    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        if (angularGap(point.angle, angle) > nearestAngle + 1e-6) continue;

        const gap = Math.abs(point.radius - radius);
        if (gap < bestGap) {
            bestGap = gap;
            best = point;
        }
    }

    if (!best) return null;

    const hit: ChartHit = {
        seriesIndex: best.seriesIndex,
        pointIndex: best.categoryIndex,
        position: {
            x: cx + Math.sin(best.angle) * best.radius,
            y: cy - Math.cos(best.angle) * best.radius,
        },
    };

    return hit;
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
