import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, Component, createEffect, createMemo, createSignal, JSX, on, Show, useContext } from "solid-js";
import { Dynamic } from "solid-js/web";
import { TutorialContext } from "./Tutorial";
import Controls from "./Controls";
import Progress from "@components/Feedback/Progress/Progress";
import Flex from "@components/Layout/Flex/Flex";
import { getSafePosition } from "@components/utils/getSafePosition";
import styles from './Tutorial.module.scss';

export interface ToolTipData {
    title?: string; 
    content?: string | JSX.Element;
    position?: TooltipPosition
}

export type TooltipPosition = "bottom" | "top" | "right" | "left" | null;

type DefaultProps = {
  class?: string;
  style?: JSX.CSSProperties;
};

export interface ProvidedProps {
    title: string | undefined,
    content: string | JSX.Element | undefined
    step: Accessor<number>,
    Next: Component<ComponentProps>,
    Prev: Component<ComponentProps>,
    progress: Accessor<number>,
}

export type TooltipType<T extends Record<string, any> = {}> = Component<ProvidedProps & T & DefaultProps>;

interface TutorialTooltipProps<T extends Record<string, any>> {
    userTooltip: TooltipType<T> | undefined,
    tooltipData: Accessor<ToolTipData>,
    progress: Accessor<number>,
    exit: () => void,
}

const DefaultTooltip: TooltipType<{exit: () => void}> = (props) => {
    return (
        <div class={styles.tooltip} >
            <h2 class={styles['tooltip-heading']}>{props.title}</h2>
            <span class={styles['tooltip-content']}>{props.content}</span>
            <Progress.Bar class={styles['tooltip-progress']} style={{width: '100%'}} progress={props.progress()}>
            </Progress.Bar>
            <Flex>
                <props.Prev class={`${styles['tooltip-control']} ${styles['tooltip-control-first']}`}>Prev</props.Prev>
                <Show when={props.progress() === 100} fallback={<props.Next class={styles['tooltip-control']}>Next</props.Next>}>
                    <div onclick={props.exit} class={`${styles['tooltip-control']}`}>Done</div>
                </Show>
            </Flex>
        </div>
    )
}

const Next = (p: ComponentProps) => <Controls {...p} direction="next" />;
const Prev = (p: ComponentProps) => <Controls {...p} direction="prev" />;

const DEFAULT_POSITION = "bottom"

const TutorialTooltip = <T extends Record<string, any> = {}>(props: TutorialTooltipProps<T>) => {
    const ctx = useContext(TutorialContext);
    if (!ctx) return;

    const [visible, setVisible] = createSignal(false);
    let elementRef: HTMLDivElement | undefined;
    let visibleTO: NodeJS.Timeout | undefined;

    const providedTooltipProps = (): ProvidedProps => {
        const data = props.tooltipData();

        return {
            title: data.title,
            content: data.content,
            step: ctx.current,
            Next,
            Prev,
            progress: props.progress,
        }
    }

    createEffect(on(ctx.current, (current) => {
        setVisible(false);

        if (visibleTO) clearTimeout(visibleTO);
        visibleTO = setTimeout(() => {
            if (current === 0) return;
            setVisible(true)
        }, 500)
    }, {defer: true}))

    const position = createMemo((prev) => {
        const currentPosition = prev || DEFAULT_POSITION;
        if (!visible() || !elementRef) return currentPosition;

        const provided = props.tooltipData().position;
        if (provided) return provided;

        const rect = elementRef!.getBoundingClientRect();
        const suggested = getSafePosition(rect!)

        return suggested || currentPosition;
    })

    const tooltipClasses = createMemo(() => {
        const classes = [styles['tooltip-wrapper']];

        if (visible()) classes.push(styles['tooltip-visible']);
        classes.push(styles[`tooltip-${position()}`]);
        return classes.join(' ');
    });

    const renderTooltip = () => {
        const tooltip = props.userTooltip;

        // Return default tooltip
        if (!tooltip) return <DefaultTooltip exit={props.exit} {...providedTooltipProps()} />

        return (tooltip as any)({ ...providedTooltipProps()});
    }

    return (
        <div ref={elementRef} class={tooltipClasses()}>
            {renderTooltip()}
        </div>
    )
}

export default TutorialTooltip;