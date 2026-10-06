import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js';
import { ChartAnimation } from '../types';

/**
 * Drives the mount-only reveal of a line, from 0 to 1.
 *
 * Deliberately the same rAF-and-attributes approach as the value tween rather
 * than CSS keyframes: `@keyframes` cannot be parameterised by a path length,
 * and `stroke-dashoffset` set through CSS requires explicit px units in
 * Gameface, whereas the SVG attribute does not.
 *
 * It runs once, when geometry first exists — not on mount, since the chart has
 * nothing to draw until its container has been measured.
 */
export const useDrawOn = (
    ready: Accessor<boolean>,
    animation: Accessor<ChartAnimation | undefined>,
): Accessor<number> => {
    const [progress, setProgress] = createSignal(1);

    let handle = 0;
    let started = false;

    onCleanup(() => cancelAnimationFrame(handle));

    createEffect(() => {
        if (started || !ready()) return;

        started = true;

        const config = animation();
        const duration = config?.duration ?? 300;
        if (!config || duration <= 0) return;

        setProgress(0);
        const start = performance.now() + (config.delay ?? 0);

        const step = (now: number) => {
            const elapsed = now - start;
            const t = elapsed <= 0 ? 0 : Math.min(1, elapsed / duration);

            setProgress(t);
            if (t < 1) handle = requestAnimationFrame(step);
        };

        handle = requestAnimationFrame(step);
    });

    return progress;
};
