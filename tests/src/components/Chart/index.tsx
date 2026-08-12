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

const ChartTest = () => {
    const [data, setData] = createSignal<ChartSeries[]>(INITIAL_DATA);
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
                    <Chart.Labels class={selectors.label} placement="outside" />
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
        </>
    );
};

export default ChartTest;
