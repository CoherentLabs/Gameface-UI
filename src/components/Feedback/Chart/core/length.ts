import { createSignal } from 'solid-js';

/** A number is pixels; a string takes a CSS unit: `px`, `rem`, `vh`, `vw`, `vmin`, `vmax`, or `%` where the prop allows it. */
export type ChartLength = number | string;

interface Viewport {
    rem: number;
    width: number;
    height: number;
}

const LENGTH_PATTERN = /^([-+]?(?:\d+\.?\d*|\.\d+))\s*([a-z%]*)$/i;

const readViewport = (): Viewport => ({
    rem: parseFloat(getComputedStyle(document.documentElement).fontSize) || 16,
    width: window.innerWidth,
    height: window.innerHeight,
});

let initialViewport: Viewport | undefined;
const [viewport, setViewport] = createSignal<Viewport | undefined>(undefined);

/**
 * Cached because geometry resolves lengths on every animation frame, and
 * `getComputedStyle` there would force a style recalculation each time. A
 * signal rather than a plain value, so that a root font size in viewport units
 * (this project's default) re-resolves every length when the window resizes.
 *
 * The first read happens while rendering, where Solid 2 does not allow signal
 * writes, so the first value is kept in a plain variable and only the resize
 * listener writes the signal.
 */
const currentViewport = (): Viewport => {
    if (!initialViewport) {
        initialViewport = readViewport();
        window.addEventListener('resize', () => setViewport(readViewport()));
    }

    return viewport() ?? initialViewport;
};

/**
 * Converts a {@link ChartLength} to pixels. `percentOf` is what `%` is a share
 * of; where the prop has no such base, a percentage resolves to `fallback`.
 */
export const resolveLength = (value: ChartLength | undefined, fallback: number, percentOf?: number): number => {
    if (value === undefined) return fallback;
    if (typeof value === 'number') return value;

    const match = LENGTH_PATTERN.exec(value.trim());
    if (!match) return fallback;

    const amount = parseFloat(match[1]);
    const { rem, width, height } = currentViewport();

    switch (match[2].toLowerCase()) {
        case '':
        case 'px': return amount;
        case 'rem': return amount * rem;
        case 'vh': return (amount * height) / 100;
        case 'vw': return (amount * width) / 100;
        case 'vmin': return (amount * Math.min(width, height)) / 100;
        case 'vmax': return (amount * Math.max(width, height)) / 100;
        case '%': return percentOf === undefined ? fallback : (amount * percentOf) / 100;
        default: return fallback;
    }
};
