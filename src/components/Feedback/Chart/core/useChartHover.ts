import { Accessor, createEffect, createSignal, JSX } from 'solid-js';
import { ChartHit, ChartHitResolver, ChartInteractive, ChartPointEvent, ChartSize } from '../types';

export type HoverMode = 'none' | 'svg' | 'overlay';

/**
 * Resolves the `interactive` prop into a concrete input mode.
 *
 * `true` picks per chart type: native SVG pointer events where each mark is its
 * own element with the right hit shape, the overlay resolver where it is not.
 * Native SVG hit-testing needs Gameface 3.1.1+; `interactive="overlay"` works
 * on any version and is also the cheaper option at high mark counts.
 */
export const resolveHoverMode = (interactive: ChartInteractive | undefined, auto: Exclude<HoverMode, 'none'>): HoverMode => {
    if (!interactive) return 'none';
    if (interactive === 'svg' || interactive === 'overlay') return interactive;

    return auto;
};

export interface UseChartHoverOptions {
    mode: Accessor<HoverMode>;
    /** Plot-local pixel position to hit. Only used in `overlay` mode. */
    resolver: Accessor<ChartHitResolver | null>;
    /** Turns a hit into the public event, or `null` if the hit is stale. */
    toEvent: (hit: ChartHit) => ChartPointEvent | null;
    plotElement: Accessor<HTMLElement | undefined>;
    /** Re-caches the plot rect whenever the chart is resized. */
    size: Accessor<ChartSize>;
    onHover?: (event: ChartPointEvent | null) => void;
    onClick?: (event: ChartPointEvent) => void;
}

/** Kept to bare handlers so it can be spread onto any SVG mark element. */
export interface MarkEventProps {
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseMove?: (event: MouseEvent) => void;
    onMouseLeave?: () => void;
    onClick?: (event: MouseEvent) => void;
}

export interface ChartHoverApi {
    hovered: Accessor<ChartPointEvent | null>;
    isHovered: (seriesIndex: number, pointIndex: number) => boolean;
    /** Spread onto a mark element. Empty unless the mode is `svg`. */
    markProps: (seriesIndex: number, pointIndex: number) => MarkEventProps;
    /** Spread onto the hit overlay. Empty unless the mode is `overlay`. */
    overlayProps: () => JSX.HTMLAttributes<HTMLDivElement>;
}

/**
 * Owns hover and click state for a chart.
 *
 * Both input modes feed the same `hovered` signal, so highlighting, the
 * tooltip and the public callbacks are implemented once and are identical
 * whichever mode is active.
 */
export const useChartHover = (options: UseChartHoverOptions): ChartHoverApi => {
    const [hovered, setHovered] = createSignal<ChartPointEvent | null>(null);

    // Cached so a mousemove never triggers a layout measurement.
    let plotRect: DOMRect | undefined;

    const refreshRect = () => {
        plotRect = options.plotElement()?.getBoundingClientRect();
    };

    createEffect(() => {
        options.size();
        refreshRect();
    });

    // Resizing is not the only thing that moves the plot — scrolling an
    // ancestor does too, and that fires no resize. Re-measuring on entry keeps
    // the cache honest at one measurement per pointer entry, while the moves
    // in between stay free.
    const onEnter = () => refreshRect();

    const toLocal = (event: MouseEvent) => {
        if (!plotRect) refreshRect();
        if (!plotRect) return null;

        return { x: event.clientX - plotRect.left, y: event.clientY - plotRect.top };
    };

    const publish = (next: ChartPointEvent | null) => {
        const previous = hovered();
        const same = previous && next
            && previous.seriesIndex === next.seriesIndex
            && previous.pointIndex === next.pointIndex;

        setHovered(next);

        // Moving within the same mark updates the tooltip position but is not
        // a new hover as far as the consumer is concerned.
        if (!same) options.onHover?.(next);
    };

    const isHovered = (seriesIndex: number, pointIndex: number) => {
        const current = hovered();
        return !!current && current.seriesIndex === seriesIndex && current.pointIndex === pointIndex;
    };

    const markProps = (seriesIndex: number, pointIndex: number): MarkEventProps => {
        if (options.mode() !== 'svg') return {};

        const eventFor = (event: MouseEvent) => {
            const position = toLocal(event) ?? { x: 0, y: 0 };
            return options.toEvent({ seriesIndex, pointIndex, position });
        };

        return {
            // mouseenter/mouseleave do not bubble, so these are per-mark
            // listeners. Above ~100 marks prefer interactive="overlay".
            onMouseEnter: (event: MouseEvent) => {
                onEnter();
                publish(eventFor(event));
            },
            onMouseMove: (event: MouseEvent) => publish(eventFor(event)),
            onMouseLeave: () => publish(null),
            onClick: (event: MouseEvent) => {
                const next = eventFor(event);
                if (next) options.onClick?.(next);
            },
        };
    };

    const overlayProps = (): JSX.HTMLAttributes<HTMLDivElement> => {
        if (options.mode() !== 'overlay') return {};

        return {
            onMouseEnter: onEnter,
            onMouseMove: (event: MouseEvent) => {
                const local = toLocal(event);
                const resolve = options.resolver();
                if (!local || !resolve) return publish(null);

                const hit = resolve(local.x, local.y);
                publish(hit ? options.toEvent(hit) : null);
            },
            onMouseLeave: () => publish(null),
            onClick: () => {
                const current = hovered();
                if (current) options.onClick?.(current);
            },
        };
    };

    return { hovered, isHovered, markProps, overlayProps };
};
