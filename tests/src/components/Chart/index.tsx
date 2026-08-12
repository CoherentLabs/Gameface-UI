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

const ChartTest = () => {
    const [data, setData] = createSignal<ChartSeries[]>(INITIAL_DATA);
    const [animation, setAnimation] = createSignal<ChartAnimation | undefined>(undefined);

    const setPoints = (points: ChartSeries['points']) => setData([{ ...INITIAL_DATA[0], points }]);

    const scenarios = [
        {
            label: 'Change values',
            action: () => setPoints([
                { type: 'strength', value: 4 },
                { type: 'agility', value: 22 },
                { type: 'stamina', value: 7 },
                { type: 'intellect', value: 11 },
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
            action: () => setAnimation({ duration: 400, easing: 'ease-out' }),
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
    };

    const TestBoilerplate = () => (
        <For each={scenarios}>
            {(scenario, index) => (
                <button class={`${selectors.scenarioBtn} scenario-${index()}`} onClick={scenario.action}>
                    {scenario.label}
                </button>
            )}
        </For>
    );

    onMount(() => document.addEventListener('reset', reset));
    onCleanup(() => document.removeEventListener('reset', reset));

    return (
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
    );
};

export default ChartTest;
