import Tab from '@components/Layout/Tab/Tab';
import { createSignal, For, onCleanup, onMount } from 'solid-js';
import selectors from '../../../shared/chart-selectors.json';
import styles from './Chart.module.scss';
import Chart from '@components/Feedback/Chart/Chart';
import { ChartAnimation, ChartSeries } from '@components/Feedback/Chart/types';

const INITIAL_DATA: ChartSeries[] = [
    {
        id: 'stats',
        label: 'Loadout',
        points: [
            { type: 'strength', value: 13 },
            { type: 'agility', value: 9 },
            { type: 'stamina', value: 16 },
            { type: 'intellect', value: 6 },
        ],
    },
];

/**
 * Long enough that a driver reading path geometry over the debugger protocol
 * still lands mid-tween. A realistic 300ms animation finishes before the reads
 * come back, which makes any "is it moving?" assertion race.
 */
const TEST_ANIMATION_MS = 2500;

/** Two series over the same categories, for grouped and stacked layouts. */
const MULTI_SERIES: ChartSeries[] = [
    {
        id: 'player',
        label: 'Player',
        points: [
            { type: 'strength', value: 13 },
            { type: 'agility', value: 9 },
            { type: 'stamina', value: 16 },
        ],
    },
    {
        id: 'enemy',
        label: 'Enemy',
        points: [
            { type: 'strength', value: 7 },
            { type: 'agility', value: 18 },
            { type: 'stamina', value: 11 },
        ],
    },
];

/** Values either side of zero, so the baseline and negative bars are exercised. */
const DIVERGING: ChartSeries[] = [
    {
        id: 'delta',
        label: 'Delta',
        points: [
            { type: 'strength', value: 6 },
            { type: 'agility', value: -9 },
            { type: 'stamina', value: 5 },
            { type: 'intellect', value: -3 },
        ],
    },
];

/** The second series skips a category, so the line has a genuine gap. */
const SPARSE: ChartSeries[] = [
    {
        id: 'full',
        label: 'Full',
        points: [
            { type: 'strength', value: 10 },
            { type: 'agility', value: 14 },
            { type: 'stamina', value: 8 },
        ],
    },
    {
        id: 'partial',
        label: 'Partial',
        points: [
            { type: 'strength', value: 4 },
            { type: 'stamina', value: 12 },
        ],
    },
];

/** Five axes, the shape a stat radar usually takes. */
const RADAR: ChartSeries[] = [
    {
        id: 'player',
        label: 'Player',
        points: [
            { type: 'strength', value: 13 },
            { type: 'agility', value: 9 },
            { type: 'stamina', value: 16 },
            { type: 'intellect', value: 6 },
            { type: 'spirit', value: 11 },
        ],
    },
    {
        id: 'enemy',
        label: 'Enemy',
        points: [
            { type: 'strength', value: 7 },
            { type: 'agility', value: 18 },
            { type: 'stamina', value: 11 },
            { type: 'intellect', value: 14 },
            { type: 'spirit', value: 4 },
        ],
    },
];

const ChartTest = () => {
    const [data, setData] = createSignal<ChartSeries[]>(INITIAL_DATA);
    const [multiSeries] = createSignal<ChartSeries[]>(MULTI_SERIES);
    const [diverging] = createSignal<ChartSeries[]>(DIVERGING);
    const [sparse] = createSignal<ChartSeries[]>(SPARSE);
    const [radar] = createSignal<ChartSeries[]>(RADAR);
    const [animation, setAnimation] = createSignal<ChartAnimation | undefined>(undefined);
    const [animationState, setAnimationState] = createSignal<'idle' | 'running' | 'done'>('idle');

    const setPoints = (points: ChartSeries['points']) => setData([{ ...INITIAL_DATA[0], points }]);

    const scenarios = [
        {
            label: 'Change values',
            // Deliberately a different total (60) to the initial data (44), so
            // an assertion on the donut hole cannot pass by coincidence.
            action: () => setPoints([
                { type: 'strength', value: 10 },
                { type: 'agility', value: 25 },
                { type: 'stamina', value: 15 },
                { type: 'intellect', value: 10 },
            ]),
        },
        {
            label: 'Add a slice',
            action: () => setPoints([...INITIAL_DATA[0].points, { type: 'spirit', value: 12 }]),
        },
        {
            label: 'Remove a slice',
            action: () => setPoints(INITIAL_DATA[0].points.slice(0, 2)),
        },
        {
            label: 'Enable animation',
            action: () => setAnimation({
                duration: TEST_ANIMATION_MS,
                easing: 'ease-out',
                // Exposed through the DOM so the lifecycle can be asserted
                // directly instead of inferred from geometry timing.
                onStart: () => setAnimationState('running'),
                onEnd: () => setAnimationState('done'),
            }),
        },
        {
            label: 'Negative value',
            action: () => setPoints([
                { type: 'strength', value: -5 },
                { type: 'agility', value: 9 },
                { type: 'stamina', value: 16 },
            ]),
        },
        {
            label: 'Empty data',
            action: () => setData([]),
        },
        {
            // Thin neighbouring slices put their outside labels at almost the
            // same angle, which is what the collision spread has to fix.
            label: 'Many thin slices',
            action: () => setPoints([
                { type: 'strength', value: 60 },
                { type: 'agility', value: 2 },
                { type: 'stamina', value: 2 },
                { type: 'intellect', value: 2 },
                { type: 'spirit', value: 2 },
                { type: 'luck', value: 2 },
            ]),
        },
    ];

    const reset = () => {
        setData(INITIAL_DATA);
        setAnimation(undefined);
        setAnimationState('idle');
    };

    const TestBoilerplate = () => (
        <>
            <For each={scenarios}>
                {(scenario, index) => (
                    <button class={`${selectors.scenarioBtn} scenario-${index()}`} onClick={scenario.action}>
                        {scenario.label}
                    </button>
                )}
            </For>
            <div class={selectors.animationState}>{animationState()}</div>
        </>
    );

    onMount(() => document.addEventListener('reset', reset));
    onCleanup(() => document.removeEventListener('reset', reset));

    return (
        <>
        <Tab location="chart-pie">
            <TestBoilerplate />

            <div class={styles.wrapper}>
                <Chart.Pie
                    class={selectors.base}
                    data={data()}
                    animation={animation()}
                    interactive
                >
                    <Chart.Pie.Slice class={selectors.slice} hoverOffset={6} padAngle={1} cornerRadius={4} />
                    <Chart.Labels class={selectors.label} placement="outside" leaderLines />
                    <Chart.Legend class={selectors.legend} position="bottom" />
                    <Chart.Tooltip class={selectors.tooltip} />
                </Chart.Pie>
                <div class={`${styles.probe} ${styles['probe-pie']} ${selectors.probe}`} />
            </div>

            {/* Same data through the overlay resolver: both modes must agree. */}
            <div class={styles.wrapper}>
                <Chart.Pie
                    class={selectors.overlayBase}
                    data={data()}
                    interactive="overlay"
                >
                    <Chart.Pie.Slice class={selectors.overlaySlice} />
                    <Chart.Tooltip class={selectors.overlayTooltip} />
                </Chart.Pie>
                <div class={`${styles.probe} ${styles['probe-overlay']} ${selectors.overlayProbe}`} />
            </div>
        </Tab>

        <Tab location="chart-donut">
            <TestBoilerplate />

            {/* Native SVG hit-testing: the hole simply has no geometry in it. */}
            <div class={styles.wrapper}>
                <Chart.Donut
                    class={selectors.donutBase}
                    data={data()}
                    animation={animation()}
                    interactive
                >
                    <Chart.Donut.Slice class={selectors.donutSlice} padAngle={1} cornerRadius={4} />
                    <Chart.Labels class={selectors.donutHoleLabel} placement="hole" />
                    <Chart.Legend position="bottom" />
                    <Chart.Tooltip class={selectors.donutTooltip} />
                </Chart.Donut>
                <div class={`${styles.probe} ${styles['probe-donut-ring']} ${selectors.donutRingProbe}`} />
                <div class={`${styles.probe} ${styles['probe-donut-hole']} ${selectors.donutHoleProbe}`} />
            </div>

            {/* Overlay resolver: the hole must be rejected by radius, not by
                the absence of geometry. Custom hole content via the slot. */}
            <div class={styles.wrapper}>
                <Chart.Donut
                    class={selectors.donutOverlayBase}
                    data={data()}
                    interactive="overlay"
                    innerRadius="40%"
                >
                    <Chart.Donut.Slice class={selectors.donutOverlaySlice} />
                    <Chart.Donut.Hole class={selectors.donutCustomHole}>Loadout</Chart.Donut.Hole>
                    <Chart.Legend position="bottom" />
                    <Chart.Tooltip class={selectors.donutOverlayTooltip} />
                </Chart.Donut>
                <div class={`${styles.probe} ${styles['probe-donut-ring']} ${selectors.donutOverlayRingProbe}`} />
                <div class={`${styles.probe} ${styles['probe-donut-hole']} ${selectors.donutOverlayHoleProbe}`} />
            </div>
        </Tab>

        <Tab location="chart-bar">
            <TestBoilerplate />

            <div class={styles.wrapper}>
                <Chart.Bar
                    class={selectors.barBase}
                    data={multiSeries()}
                    animation={animation()}
                    interactive
                >
                    <Chart.Bar.Fill class={selectors.barMark} />
                    <Chart.YAxis class={selectors.barValueLabel} />
                    <Chart.XAxis class={selectors.barCategoryLabel} />
                    <Chart.Grid horizontal />
                    <Chart.Legend class={selectors.barLegend} position="bottom" />
                    <Chart.Tooltip class={selectors.barTooltip} />
                </Chart.Bar>
                <div class={`${styles.probe} ${styles['probe-bar']} ${selectors.barProbe}`} />
            </div>

            <div class={styles.wrapper}>
                <Chart.Bar
                    class={selectors.stackedBase}
                    data={multiSeries()}
                    layout="stacked"
                >
                    <Chart.Bar.Fill class={selectors.stackedMark} />
                    <Chart.YAxis />
                    <Chart.XAxis />
                </Chart.Bar>
            </div>

            <div class={styles.wrapper}>
                <Chart.Bar
                    class={selectors.horizontalBase}
                    data={multiSeries()}
                    orientation="horizontal"
                >
                    <Chart.Bar.Fill class={selectors.horizontalMark} />
                    <Chart.XAxis />
                    <Chart.YAxis />
                </Chart.Bar>
            </div>

            {/* Values either side of zero, to check the baseline. */}
            <div class={styles.wrapper}>
                <Chart.Bar
                    class={selectors.divergingBase}
                    data={diverging()}
                >
                    <Chart.Bar.Fill class={selectors.divergingMark} />
                    <Chart.YAxis />
                    <Chart.XAxis />
                </Chart.Bar>
            </div>
        </Tab>

        <Tab location="chart-line">
            <TestBoilerplate />

            <div class={styles.wrapper}>
                <Chart.Line
                    class={selectors.lineBase}
                    data={multiSeries()}
                    animation={animation()}
                    interactive
                >
                    <Chart.Line.Stroke class={selectors.lineStroke} />
                    <Chart.Line.Point class={selectors.linePoint} show="always" />
                    <Chart.YAxis />
                    <Chart.XAxis />
                    <Chart.Grid horizontal />
                    <Chart.Legend class={selectors.lineLegend} position="bottom" />
                    <Chart.Tooltip class={selectors.lineTooltip} />
                </Chart.Line>
                <div class={`${styles.probe} ${styles['probe-line']} ${selectors.lineProbe}`} />
            </div>

            {/* Animation is set from mount, which is the only time the draw-on
                reveal can start — a chart given its animation later has already
                drawn itself. */}
            <div class={styles.wrapper}>
                <Chart.Line
                    class={selectors.drawOnBase}
                    data={multiSeries()}
                    animation={{ duration: TEST_ANIMATION_MS }}
                >
                    <Chart.Line.Stroke class={selectors.drawOnStroke} />
                    <Chart.YAxis />
                    <Chart.XAxis />
                </Chart.Line>
            </div>

            {/* A series that skips a category, to exercise gaps. */}
            <div class={styles.wrapper}>
                <Chart.Line
                    class={selectors.gapBase}
                    data={sparse()}
                    connectNulls={false}
                    curve="smooth"
                >
                    <Chart.Line.Stroke class={selectors.gapStroke} />
                    <Chart.YAxis />
                    <Chart.XAxis />
                </Chart.Line>
            </div>
        </Tab>

        <Tab location="chart-area">
            <TestBoilerplate />

            <div class={styles.wrapper}>
                <Chart.Area
                    class={selectors.areaBase}
                    data={multiSeries()}
                    interactive
                >
                    <Chart.Area.Fill class={selectors.areaFill} />
                    <Chart.Area.Stroke class={selectors.areaStroke} />
                    <Chart.YAxis />
                    <Chart.XAxis />
                    <Chart.Legend position="bottom" />
                    <Chart.Tooltip class={selectors.areaTooltip} />
                </Chart.Area>
                <div class={`${styles.probe} ${styles['probe-line']} ${selectors.areaProbe}`} />
            </div>

            <div class={styles.wrapper}>
                <Chart.Area
                    class={selectors.stackedAreaBase}
                    data={multiSeries()}
                    stacked
                >
                    <Chart.Area.Fill class={selectors.stackedAreaFill} />
                    <Chart.YAxis />
                    <Chart.XAxis />
                </Chart.Area>
            </div>
        </Tab>

        <Tab location="chart-spider">
            <TestBoilerplate />

            <div class={styles.wrapper}>
                <Chart.Spider
                    class={selectors.spiderBase}
                    data={radar()}
                    animation={animation()}
                    interactive
                >
                    <Chart.Spider.Shape class={selectors.spiderShape} />
                    <Chart.Spider.Web class={selectors.spiderWeb} levels={4} />
                    <Chart.Spider.Axis class={selectors.spiderAxis} />
                    <Chart.Legend class={selectors.spiderLegend} position="bottom" />
                    <Chart.Tooltip class={selectors.spiderTooltip} />
                </Chart.Spider>
                <div class={`${styles.probe} ${styles['probe-spider']} ${selectors.spiderProbe}`} />
            </div>

            {/* A fixed outer ring: low stats must not fill the web. */}
            <div class={styles.wrapper}>
                <Chart.Spider
                    class={selectors.spiderFixedBase}
                    data={radar()}
                    maxValue={100}
                >
                    <Chart.Spider.Shape class={selectors.spiderFixedShape} />
                    <Chart.Spider.Web shape="circle" levels={5} class={selectors.spiderCircleWeb} />
                </Chart.Spider>
            </div>
        </Tab>
        </>
    );
};

export default ChartTest;
