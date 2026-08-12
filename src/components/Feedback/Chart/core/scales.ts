import { ticks as d3Ticks } from 'd3-array';

/**
 * Minimal scales, hand-rolled on purpose.
 *
 * `d3-scale` would pull in `d3-format`, `d3-time`, `d3-time-format`,
 * `d3-interpolate` and `d3-color` for locale formatting and time axes this
 * spec does not use. The three scale types below are the whole requirement;
 * d3 still does all of the *geometry* through `d3-shape`.
 */

export interface LinearScale {
    (value: number): number;
    domain: [number, number];
    range: [number, number];
    /** Tick values across the domain, chosen for round numbers. */
    ticks: (count?: number) => number[];
}

export interface BandScale {
    (index: number): number;
    /** Width of one band, excluding padding. */
    bandwidth: number;
    /** Distance between the starts of two adjacent bands. */
    step: number;
    count: number;
    range: [number, number];
    /** Which band a position falls in, or -1 outside the range. */
    indexAt: (position: number) => number;
}

const DEFAULT_TICK_COUNT = 5;

/**
 * Expands a domain out to round numbers so ticks land on readable values.
 * Mirrors what d3's `nice()` does for a linear scale.
 */
export const niceDomain = (min: number, max: number, count = DEFAULT_TICK_COUNT): [number, number] => {
    if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
    if (min === max) return min === 0 ? [0, 1] : [Math.min(0, min), Math.max(0, max)];

    const step = tickStep(min, max, count);
    if (!Number.isFinite(step) || step <= 0) return [min, max];

    return [Math.floor(min / step) * step, Math.ceil(max / step) * step];
};

const tickStep = (min: number, max: number, count: number) => {
    const raw = (max - min) / Math.max(1, count);
    const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
    const normalised = raw / magnitude;

    // Snap to 1, 2, 5 or 10 times a power of ten, the steps people read easily.
    const snapped = normalised >= 7.5 ? 10 : normalised >= 3 ? 5 : normalised >= 1.5 ? 2 : 1;

    return snapped * magnitude;
};

export const createLinearScale = (domain: [number, number], range: [number, number]): LinearScale => {
    const [d0, d1] = domain;
    const [r0, r1] = range;
    const span = d1 - d0;

    // A zero-width domain would divide by zero; pin everything to the range start.
    const project = span === 0
        ? () => r0
        : (value: number) => r0 + ((value - d0) / span) * (r1 - r0);

    const scale = ((value: number) => project(value)) as LinearScale;
    scale.domain = domain;
    scale.range = range;
    scale.ticks = (count = DEFAULT_TICK_COUNT) => d3Ticks(d0, d1, count);

    return scale;
};

export interface BandScaleOptions {
    /** Share of a step left as gap between bands, 0 to 1. */
    paddingInner?: number;
    /** Share of a step left as gap at each end, 0 to 1. */
    paddingOuter?: number;
}

export const createBandScale = (
    count: number,
    range: [number, number],
    options: BandScaleOptions = {},
): BandScale => {
    const [r0, r1] = range;
    const paddingInner = options.paddingInner ?? 0;
    const paddingOuter = options.paddingOuter ?? 0;
    const width = r1 - r0;

    // n bands, n-1 inner gaps and 2 outer gaps, all measured in steps.
    const steps = Math.max(1, count - paddingInner + paddingOuter * 2);
    const step = count > 0 ? width / steps : 0;
    const bandwidth = step * (1 - paddingInner);
    const start = r0 + step * paddingOuter;

    const scale = ((index: number) => start + index * step) as BandScale;
    scale.bandwidth = bandwidth;
    scale.step = step;
    scale.count = count;
    scale.range = range;
    scale.indexAt = (position: number) => {
        if (step <= 0 || position < r0 || position > r1) return -1;

        const index = Math.floor((position - start) / step);
        return index < 0 || index >= count ? -1 : index;
    };

    return scale;
};

/** Centre of a band — where a category label or a line's vertex belongs. */
export const bandCentre = (scale: BandScale, index: number) => scale(index) + scale.bandwidth / 2;
