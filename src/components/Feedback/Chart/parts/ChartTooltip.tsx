import { Component, createEffect, createMemo, createSignal, Show, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import styles from '../Chart.module.scss';
import { ChartPointEvent } from '../types';
import { TooltipTokenProps } from '../slots';
import { resolveLength } from '../core/length';
import { getSafePosition } from '@components/utils/getSafePosition';
import { waitForFrames } from '@components/utils/waitForFrames';

type Side = 'top' | 'bottom' | 'left' | 'right';

const DEFAULT_OFFSET = '0.75rem';

interface ChartTooltipProps {
    token: TooltipTokenProps;
    event: ChartPointEvent;
}

/**
 * The existing `createTooltip` factory wraps a fixed child element; a chart
 * tooltip instead follows a moving pointer with content that changes per
 * point, so it is its own element positioned inside the plot container.
 */
const ChartTooltip: Component<ChartTooltipProps> = (props) => {
    /** The side the consumer pinned, or `undefined` for `auto`. */
    const fixedSide = () => (props.token.position && props.token.position !== 'auto' ? props.token.position : undefined);
    const [side, setSide] = createSignal<Side>(untrack(fixedSide) ?? 'top');
    let element!: HTMLDivElement;

    // Re-run per hovered point rather than per pointer move: flipping is about
    // which edge of the viewport is near, not about sub-pixel movement.
    // `props.event` is a new object on every move and effects never compare,
    // so the key goes through a memo, whose `===` check stops the re-run.
    // The position is read once per hovered point, untracked.
    const pointKey = createMemo(() => `${props.event.seriesIndex}:${props.event.pointIndex}`);
    createEffect(pointKey, () => {
        const fixed = untrack(fixedSide);
        setSide(fixed ?? 'top');
        if (fixed) return;

        waitForFrames(() => {
            if (!element) return;

            const safe = getSafePosition(element.getBoundingClientRect());
            if (safe) setSide(safe as Side);
        });
    });

    const positionStyles = (): JSX.CSSProperties => {
        const { x, y } = props.event.position;
        const offset = resolveLength(props.token.offset ?? DEFAULT_OFFSET, 0);

        switch (side()) {
            case 'bottom':
                return { left: `${x}px`, top: `${y + offset}px`, transform: 'translate(-50%, 0)' };
            case 'left':
                return { left: `${x - offset}px`, top: `${y}px`, transform: 'translate(-100%, -50%)' };
            case 'right':
                return { left: `${x + offset}px`, top: `${y}px`, transform: 'translate(0, -50%)' };
            default:
                return { left: `${x}px`, top: `${y - offset}px`, transform: 'translate(-50%, -100%)' };
        }
    };

    return (
        <div ref={element} class={[styles.tooltip, props.token.class]} style={{ ...positionStyles(), ...props.token.style }}>
            <Show when={props.token.content} fallback={
                <>
                    <span class={styles['tooltip-label']}>{props.event.point.label ?? props.event.point.type}</span>
                    <span class={styles['tooltip-value']}>{props.event.point.value}</span>
                </>
            }>
                {props.token.content!(props.event)}
            </Show>
        </div>
    );
};

export default ChartTooltip;
