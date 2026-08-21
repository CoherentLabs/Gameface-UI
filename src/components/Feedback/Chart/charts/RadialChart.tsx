import { arc, pie } from 'd3-shape';
import { createMemo, Index, JSX, ParentComponent, ParentProps, Show } from 'solid-js';
import { createTokenComponent, TokenBase, useToken } from '@components/utils/tokenComponents';
import styles from '../Chart.module.scss';
import { BaseChartProps, ChartHit, LegendEntry } from '../types';
import { Labels, Legend, Tooltip } from '../slots';
import { useChartData } from '../core/useChartData';
import { useChartTween } from '../core/useChartTween';
import { useChartSize } from '../core/useChartSize';
import { resolveHoverMode, useChartHover } from '../core/useChartHover';
import { createRadialResolver, RadialSlice } from '../core/resolvers/radial';
import { createPointEvent } from '../core/events';
import { DEFAULT_PALETTE, resolveColor } from '../core/palette';
import { formatChartNumber, resolveInnerRadius } from '../core/radius';
import { warnOnce, warnOnMarkBudget } from '../core/warnOnce';
import ChartRoot from '../parts/ChartRoot';
import ChartLabels, { ChartLabelAnchor } from '../parts/ChartLabels';

export type TokenComponent<T extends Record<string, any>> = ReturnType<typeof createTokenComponent<T>>;

export interface SliceTokenProps extends TokenBase {
    /** Degrees of padding between slices. */
    padAngle?: number;
    cornerRadius?: number;
    /** Pixels the hovered slice pops out along its centroid. */
    hoverOffset?: number;
}

export interface HoleTokenProps extends TokenBase, ParentProps { }

export interface RadialChartProps extends BaseChartProps {
    /** Degrees, clockwise from 12 o'clock. Defaults to 0. */
    startAngle?: number;
    /** Defaults to 360, a full circle. */
    endAngle?: number;
    /** Pixels (`40`, `'40px'`) or a share of the outer radius (`'60%'`). */
    innerRadius?: number | string;
}

/** Supplied by the concrete chart, never by the consumer. */
interface RadialChartConfig {
    componentClass: string;
    /** Used in dev warnings so they name the component the consumer wrote. */
    displayName: string;
    sliceTokenizer: TokenComponent<SliceTokenProps>;
    holeTokenizer?: TokenComponent<HoleTokenProps>;
    /** Applied when the consumer gives no `innerRadius`. */
    defaultInnerRadius?: number | string;
}

const DEG = Math.PI / 180;
const OUTSIDE_LABEL_GAP = 10;
/** Room kept for labels drawn outside the circle. */
const OUTSIDE_LABEL_RESERVE = 52;
/** Minimum vertical distance between two labels on the same side. */
const LABEL_LINE_HEIGHT = 16;
/** How far a leader line runs radially before turning towards its label. */
const LEADER_ELBOW = 6;
/** Breathing room between the end of a leader line and the text it points at. */
const LEADER_TEXT_GAP = 3;

/**
 * Pushes overlapping outside labels apart vertically.
 *
 * Thin slices put their labels at nearly the same angle, so without this the
 * text stacks on itself and becomes unreadable. Each side of the circle is
 * spread independently — they never collide with each other — and only along y,
 * so every label stays on the side its slice is actually on.
 */
const spreadOutsideLabels = (anchors: ChartLabelAnchor[], centreY: number): ChartLabelAnchor[] => {
    const sides: ChartLabelAnchor[][] = [
        anchors.filter(anchor => anchor.align === 'start'),
        anchors.filter(anchor => anchor.align === 'end'),
    ];

    for (const side of sides) {
        side.sort((a, b) => a.y - b.y);

        // Walk down from the top, pushing any label that would overlap the one
        // above it far enough down to clear.
        for (let i = 1; i < side.length; i++) {
            const gap = side[i].y - side[i - 1].y;
            if (gap < LABEL_LINE_HEIGHT) side[i].y = side[i - 1].y + LABEL_LINE_HEIGHT;
        }

        // That can push the last few off the bottom, so walk back up and take
        // the slack out of the top instead, keeping the run centred.
        for (let i = side.length - 2; i >= 0; i--) {
            const gap = side[i + 1].y - side[i].y;
            if (gap < LABEL_LINE_HEIGHT) side[i].y = side[i + 1].y - LABEL_LINE_HEIGHT;
        }

        // A run longer than the chart is a lost cause; centring it at least
        // keeps the overflow even top and bottom rather than all at one end.
        if (side.length > 1) {
            const span = side[side.length - 1].y - side[0].y;
            const drift = (side[0].y + span / 2) - centreY;

            if (Math.abs(drift) > 1) {
                for (const anchor of side) anchor.y -= drift;
            }
        }
    }

    return anchors;
};

/**
 * The shared pie/donut implementation.
 *
 * The two differ only by an inner radius and what may sit in the middle, so
 * they share one geometry pipeline, one hit-testing setup and one legend.
 */
export const createRadialChart = (config: RadialChartConfig): ParentComponent<RadialChartProps> => (props) => {
    const legendToken = useToken(Legend, props.children);
    const tooltipToken = useToken(Tooltip, props.children);
    const labelsToken = useToken(Labels, props.children);
    const sliceToken = useToken(config.sliceTokenizer, props.children);
    const holeToken = config.holeTokenizer
        ? useToken(config.holeTokenizer, props.children)
        : () => null;

    const [size, observePlot] = useChartSize();
    const model = useChartData(() => props.data, props.onSeriesToggle);
    const frame = useChartTween(model.normalised, () => props.animation);

    let plotElement: HTMLDivElement | undefined;

    const palette = () => props.palette ?? DEFAULT_PALETTE;
    const placement = () => labelsToken()?.placement ?? 'inside';
    const showsHole = () => !!holeToken() || placement() === 'hole';

    /** These charts show one series; more would need concentric rings. */
    const seriesIndex = createMemo(() => {
        if (props.data?.length > 1) {
            warnOnce(`[${config.displayName}] Only the first series is rendered. Give each slice its own point, or use one chart per series.`);
        }

        return model.visibleIn(frame().data)[0];
    });

    const geometry = createMemo(() => {
        const { width, height } = size();
        const index = seriesIndex();
        if (width <= 0 || height <= 0 || index === undefined) return null;

        const { data, values } = frame();
        const categories = data.categories;
        const offset = index * categories.length;

        const visible: { pointIndex: number; value: number }[] = [];
        for (let c = 0; c < categories.length; c++) {
            if (!model.isPointVisible(index, c, data)) continue;

            const value = values[offset + c] ?? 0;
            if (value < 0) {
                warnOnce(`[${config.displayName}] Negative values have no meaning here and are treated as 0.`);
            }

            // A zero-value slice would emit a degenerate, invisible path that
            // still costs an element. It reappears as soon as it tweens above 0.
            if (value <= 0) continue;

            visible.push({ pointIndex: c, value });
        }

        const total = visible.reduce((sum, slice) => sum + slice.value, 0);
        if (total <= 0) return null;

        const token = sliceToken();
        const outsideReserve = placement() === 'outside' ? OUTSIDE_LABEL_RESERVE : 0;
        const outerRadius = Math.min(width, height) / 2 - outsideReserve;
        if (outerRadius <= 0) return null;

        const innerRadius = resolveInnerRadius(props.innerRadius ?? config.defaultInnerRadius, outerRadius);
        const centre = { x: width / 2, y: height / 2 };

        const layout = pie<{ pointIndex: number; value: number }>()
            .sort(null)
            .value(slice => slice.value)
            .startAngle((props.startAngle ?? 0) * DEG)
            .endAngle((props.endAngle ?? 360) * DEG)
            .padAngle((token?.padAngle ?? 0) * DEG);

        const generator = arc<{ startAngle: number; endAngle: number; padAngle: number }>()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .cornerRadius(token?.cornerRadius ?? 0);

        const arcs = layout(visible).map((entry) => ({
            pointIndex: entry.data.pointIndex,
            value: entry.data.value,
            startAngle: entry.startAngle,
            endAngle: entry.endAngle,
            midAngle: (entry.startAngle + entry.endAngle) / 2,
            d: generator(entry) ?? '',
            centroid: generator.centroid(entry) as [number, number],
            color: resolveColor(
                palette(),
                entry.data.pointIndex,
                data.series[index],
                data.series[index]?.points?.find(point => point.type === categories[entry.data.pointIndex]),
            ),
        }));

        warnOnMarkBudget(config.displayName, arcs.length);

        return { centre, outerRadius, innerRadius, arcs, seriesIndex: index, categories, total };
    });

    const hoverMode = () => resolveHoverMode(props.interactive, 'svg');

    const resolver = createRadialResolver(
        () => geometry()?.centre ?? { x: 0, y: 0 },
        () => {
            const current = geometry();
            if (!current) return [];

            return current.arcs.map<RadialSlice>(entry => ({
                seriesIndex: current.seriesIndex,
                pointIndex: entry.pointIndex,
                startAngle: entry.startAngle,
                endAngle: entry.endAngle,
                // The hole is a real gap: pointing at it resolves to nothing.
                innerRadius: current.innerRadius,
                outerRadius: current.outerRadius,
            }));
        },
    );

    const hover = useChartHover({
        mode: hoverMode,
        resolver: () => resolver,
        plotElement: () => plotElement,
        size,
        toEvent: (hit: ChartHit) => createPointEvent(frame().data.series, frame().data.categories, hit),
        onHover: event => props.onPointHover?.(event),
        onClick: event => props.onPointClick?.(event),
    });

    /** One series means the legend lists slices rather than series. */
    const entries = createMemo<LegendEntry[]>(() => {
        const index = seriesIndex();
        const { data } = frame();
        if (index === undefined) return [];

        const series = data.series[index];

        return data.categories.map((category, pointIndex) => {
            const point = series?.points?.find(candidate => candidate.type === category);

            return {
                label: point?.label ?? category,
                color: resolveColor(palette(), pointIndex, series, point),
                seriesIndex: index,
                pointIndex,
                visible: model.isPointVisible(index, pointIndex, data),
            };
        });
    });

    const labelAnchors = createMemo<ChartLabelAnchor[]>(() => {
        const token = labelsToken();
        const current = geometry();
        if (!token || !current || token.show === 'never' || placement() === 'hole') return [];

        const hovered = hover.hovered();
        const { data } = frame();
        const series = data.series[current.seriesIndex];

        const anchors = current.arcs.reduce<ChartLabelAnchor[]>((acc, entry) => {
            if (token.show === 'hover' && hovered?.pointIndex !== entry.pointIndex) return acc;

            const category = current.categories[entry.pointIndex];
            const point = series?.points?.find(candidate => candidate.type === category)
                ?? { type: category, value: entry.value };

            const outside = placement() === 'outside';
            const radius = outside ? current.outerRadius + OUTSIDE_LABEL_GAP : 0;
            const x = outside ? current.centre.x + Math.sin(entry.midAngle) * radius : current.centre.x + entry.centroid[0];
            const y = outside ? current.centre.y - Math.cos(entry.midAngle) * radius : current.centre.y + entry.centroid[1];

            acc.push({
                key: category,
                x,
                y,
                text: token.format ? token.format(point, series) : (point.label ?? category),
                align: outside ? (Math.sin(entry.midAngle) >= 0 ? 'start' : 'end') : 'center',
                seriesIndex: current.seriesIndex,
                pointIndex: entry.pointIndex,
            });

            return acc;
        }, []);

        return placement() === 'outside' ? spreadOutsideLabels(anchors, current.centre.y) : anchors;
    });

    /**
     * Connectors from each slice to its label.
     *
     * Only worth drawing once labels have been de-overlapped: a label that has
     * been pushed away from its own angle is exactly the one whose owner is no
     * longer obvious. Points are relative to the centre, since they render
     * inside the translated group with the slices.
     */
    const leaderLines = createMemo(() => {
        const current = geometry();
        if (!current || placement() !== 'outside' || !labelsToken()?.leaderLines) return [];

        const byPoint = new Map(current.arcs.map(entry => [entry.pointIndex, entry.midAngle]));

        return labelAnchors().reduce<{ key: string; points: string }[]>((acc, anchor) => {
            const midAngle = byPoint.get(anchor.pointIndex);
            if (midAngle === undefined) return acc;

            const sin = Math.sin(midAngle);
            const cos = Math.cos(midAngle);

            // Out along the radius first, then across to the label — the elbow
            // is what lets the line survive the label being moved vertically.
            const elbowRadius = current.outerRadius + LEADER_ELBOW;
            const side = anchor.align === 'start' ? 1 : -1;

            const points = [
                `${sin * current.outerRadius},${-cos * current.outerRadius}`,
                `${sin * elbowRadius},${-cos * elbowRadius}`,
                `${anchor.x - current.centre.x - side * LEADER_TEXT_GAP},${anchor.y - current.centre.y}`,
            ].join(' ');

            acc.push({ key: anchor.key, points });
            return acc;
        }, []);
    });

    /**
     * The hole slot owns the container; `Labels placement="hole"` supplies the
     * default content. Explicit children always win over the derived text.
     */
    const holeContent = (): JSX.Element => {
        const token = holeToken();
        if (token?.children) return token.children;
        if (placement() !== 'hole') return null;

        const current = geometry();
        if (!current) return null;

        const labels = labelsToken();
        const hovered = hover.hovered();

        if (!hovered) {
            const totalPoint = { type: 'total', value: current.total };
            const series = frame().data.series[current.seriesIndex];

            return (
                <span class={styles['hole-value']}>
                    {labels?.format ? labels.format(totalPoint, series) : formatChartNumber(current.total)}
                </span>
            );
        }

        return (
            <>
                <span class={styles['hole-value']}>
                    {labels?.format ? labels.format(hovered.point, hovered.series) : formatChartNumber(hovered.point.value)}
                </span>
                <span class={styles['hole-label']}>{hovered.point.label ?? hovered.point.type}</span>
            </>
        );
    };

    const sliceTransform = (pointIndex: number, midAngle: number) => {
        const offset = sliceToken()?.hoverOffset ?? 0;
        const current = geometry();
        if (!offset || !current || !hover.isHovered(current.seriesIndex, pointIndex)) return undefined;

        return `translate(${Math.sin(midAngle) * offset} ${-Math.cos(midAngle) * offset})`;
    };

    const sliceClasses = (pointIndex: number) => {
        const list = [styles.slice];
        if (hover.isHovered(geometry()?.seriesIndex ?? -1, pointIndex)) list.push(styles['is-hovered']);
        if (sliceToken()?.class) list.push(sliceToken()!.class!);

        return list.join(' ');
    };

    /**
     * The Hole slot styles the container. When the content comes from
     * `Labels placement="hole"` instead, that slot's class and style apply too
     * — otherwise a hole filled by Labels would have nothing to target.
     */
    const holeLabels = () => (placement() === 'hole' ? labelsToken() : null);

    const holeClasses = () => [styles.hole, holeToken()?.class, holeLabels()?.class]
        .filter(Boolean)
        .join(' ');

    const holeStyles = (): JSX.CSSProperties => {
        const current = geometry();
        if (!current) return {};

        return {
            left: `${current.centre.x}px`,
            top: `${current.centre.y}px`,
            width: `${current.innerRadius * 2}px`,
            height: `${current.innerRadius * 2}px`,
            ...holeLabels()?.style,
            ...holeToken()?.style,
        };
    };

    return (
        <ChartRoot
            componentProps={props}
            componentClass={config.componentClass}
            legend={legendToken()}
            tooltip={tooltipToken()}
            entries={entries()}
            onToggle={entry => (entry.pointIndex === undefined
                ? model.toggleSeries(entry.seriesIndex)
                : model.togglePoint(entry.seriesIndex, entry.pointIndex))}
            hovered={hover.hovered()}
            plotRef={(element) => { plotElement = element; observePlot(element); }}
            overlayProps={hover.overlayProps()}
            showOverlay={hoverMode() === 'overlay'}
        >
            <svg
                class={styles.svg}
                width={size().width}
                height={size().height}
                // Never swallow input meant for the game when not interactive.
                style={{ 'pointer-events': hoverMode() === 'none' ? 'none' : undefined }}
            >
                <Show when={geometry()}>
                    <g transform={`translate(${geometry()!.centre.x} ${geometry()!.centre.y})`}>
                        {/*
                          * Index, not For. A tween rebuilds the arc objects on
                          * every frame, and For is keyed by reference — it would
                          * tear down and recreate every <path> 60 times a
                          * second. Index keys by position, so the elements
                          * persist and only their attributes update.
                          */}
                        <Index each={geometry()!.arcs}>{(entry) => {
                            // Built once per position; the handlers read the
                            // current indices when an event actually fires.
                            const marks = hover.markProps(
                                () => geometry()?.seriesIndex ?? -1,
                                () => entry().pointIndex,
                            );

                            return (
                                <path
                                    d={entry().d}
                                    fill={entry().color}
                                    class={sliceClasses(entry().pointIndex)}
                                    style={sliceToken()?.style}
                                    transform={sliceTransform(entry().pointIndex, entry().midAngle)}
                                    {...marks}
                                />
                            );
                        }}</Index>

                        {/* Drawn after the slices so a connector is never
                            buried under the mark it points away from. */}
                        <Index each={leaderLines()}>{(leader) => (
                            <polyline points={leader().points} class={styles['leader-line']} />
                        )}</Index>
                    </g>
                </Show>
            </svg>

            <Show when={labelsToken()}>
                <ChartLabels token={labelsToken()!} anchors={labelAnchors()} />
            </Show>

            <Show when={showsHole() && geometry()}>
                <div class={holeClasses()} style={holeStyles()}>
                    {holeContent()}
                </div>
            </Show>
        </ChartRoot>
    );
};
