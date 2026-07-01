import Progress from "@components/Feedback/Progress/Progress"
import styles from './SegmentedProgressBar.module.scss';
import { Component, createMemo } from "solid-js";

// Keep these in sync with $segments / $gap / $overshoot in the .scss module.
const SEGMENTS = 10;
const GAP = 1.5;
const OVERSHOOT = 0.5;
const PILL_WIDTH = (100 + GAP + OVERSHOOT) / SEGMENTS; // width of one pill + gap

const clampValueToSegment = (value: number) => {
    const pills = Math.floor(value / (100 / SEGMENTS));

    if (pills <= 0) return 0;
    if (pills >= SEGMENTS) return 100;

    return (pills * PILL_WIDTH) - (GAP / 2);
}

const SegmentedProgressBar: Component<{value: number}> = (props) => {
    const progressFillClasses = createMemo(() => {
        const base = [styles['bar-fill']];

        const value = props.value;

        if (value >= 50) base.push(styles.success)
        else if (value >= 30) base.push(styles.warning)
        else base.push(styles.error)

        return base.join(' ');
    })

    return (
        <Progress.Bar 
            class={styles.bar} 
            progress={clampValueToSegment(props.value)}>
            <Progress.Bar.Fill class={progressFillClasses()}/>
        </Progress.Bar>
    )
}

export default SegmentedProgressBar;