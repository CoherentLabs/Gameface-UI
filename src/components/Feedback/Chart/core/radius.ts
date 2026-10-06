import { ChartLength, resolveLength } from './length';

const clamp = (value: number, min: number, max: number) => (value < min ? min : value > max ? max : value);

/**
 * Resolves an inner radius given as a length (`40`, `'2rem'`) or a share of
 * the outer radius (`'60%'`).
 *
 * Always clamped into `[0, outerRadius]`, so an oversized value flattens the
 * ring rather than producing an inverted, self-intersecting arc.
 */
export const resolveInnerRadius = (value: ChartLength | undefined, outerRadius: number): number =>
    clamp(resolveLength(value, 0, outerRadius), 0, outerRadius);

/** Keeps a tweening value readable: whole numbers stay whole, mid-tween values get one decimal. */
export const formatChartNumber = (value: number) =>
    (Number.isInteger(value) ? String(value) : value.toFixed(1));
