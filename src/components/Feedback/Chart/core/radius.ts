const clamp = (value: number, min: number, max: number) => (value < min ? min : value > max ? max : value);

/**
 * Resolves an inner radius given either pixels (`40`, `'40px'`) or a share of
 * the outer radius (`'60%'`).
 *
 * Always clamped into `[0, outerRadius]`, so an oversized value flattens the
 * ring rather than producing an inverted, self-intersecting arc.
 */
export const resolveInnerRadius = (value: number | string | undefined, outerRadius: number): number => {
    if (value === undefined) return 0;
    if (typeof value === 'number') return clamp(value, 0, outerRadius);

    const trimmed = value.trim();
    const parsed = parseFloat(trimmed);
    if (!Number.isFinite(parsed)) return 0;

    return clamp(trimmed.endsWith('%') ? (outerRadius * parsed) / 100 : parsed, 0, outerRadius);
};

/** Keeps a tweening value readable: whole numbers stay whole, mid-tween values get one decimal. */
export const formatChartNumber = (value: number) =>
    (Number.isInteger(value) ? String(value) : value.toFixed(1));
