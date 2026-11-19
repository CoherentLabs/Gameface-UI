import { Accessor, createContext, createEffect, createMemo, createSignal, Setter, Show, untrack } from "solid-js";
import { Portal, type JSX } from "@solidjs/web";
import { ComponentProps } from "@components/types/ComponentProps";
import Step from "./Step";
import styles from './Tutorial.module.scss';
import TutorialTooltip, { ToolTipData, TooltipType } from "./TutorialTooltip";
import { clamp } from "@components/utils/clamp";
import getScrollableParent from "@components/utils/getScrollableParent";
import { waitForFrames } from "@components/utils/waitForFrames";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";

export type HighlightRect = Omit<DOMRect, 'bottom' | 'right' | 'x' | 'y' | 'toJSON'>;

interface TutorialProps<T extends Record<string, any> = {}> extends ComponentProps {
    outset?: number
    tooltip?: TooltipType<T>,
    onChange?: (step: number) => void,
    onStart?: () => void,
    onEnd?: () => void,
}

interface TutorialContextType {
    current: Accessor<number>,
    setTarget: Setter<HTMLElement | null>
    setCount: Setter<number>,
    nextStep: () => void,
    previousStep: () => void,
    exit: () => void,
    setTooltipData: Setter<ToolTipData>,
    initialRender: Accessor<boolean>,
    setInitialRender: Setter<boolean>,
    setOutset: Setter<number | null>,
    progress: Accessor<number>,
}
// Null default: Solid 2 throws when a context without a default is read outside its provider.
export const TutorialContext = createContext<TutorialContextType | null>(null);

export interface TutorialRef {
    element: HTMLDivElement;
    progress: Accessor<number>,
    current: Accessor<number>,
    target: Accessor<HTMLElement | null>,
    tour: (step?: number) => void,
    exit: () => void,
    next: () => void,
    previous: () => void,
    pause: () => void,
    resume: (next?: boolean) => void,
    changeStep: (step: number) => void,
}

function Tutorial<T extends Record<string, any> = {}>(props: TutorialProps<T>): JSX.Element {
    // The initial outset (read once, as in 1.x); steps can override it with their own `outset`.
    const initialOutset = untrack(() => props.outset ?? 0)
    const [currentStep, setCurrentStep] = createSignal<number>(0);
    const [outset, setOutset] = createSignal<number | null>(initialOutset)
    const [pausedAt, setPausedAt] = createSignal<number | null>(null);
    const [initialRender, setInitialRender] = createSignal(true);
    const [targetElement, setTargetElement] = createSignal<HTMLElement | null>(null);
    const [tutorialStyles, setTutorialStyles] = createSignal<JSX.CSSProperties>({});
    const [tooltipData, setTooltipData] = createSignal<ToolTipData>({});
    const [count, setCount] = createSignal(0);

    // Always-current plain copy of the step (Solid 2 stages signal writes). onChange is reported here,
    // at the write, once per step change (0 = not running). 1.x reported it from the highlight effect,
    // after the target was measured (up to 3 frames later) and again whenever the target changed.
    let current = 0;
    const writeStep = (step: number) => {
        if (step === current) return;
        current = step;
        setCurrentStep(step);
        props.onChange?.(step);
    };

    // Starts the tour from the specified step (defaults to step 1)
    const tour = (from?: number) => {
        if (current !== 0) {
            return console.warn("Trying to start a new tour while another one is already in progress.");
        }
        changeStep(from || 1);
        props.onStart?.();
    };

    // Cancels the tour and resets to initial state
    const exit = () => {
        writeStep(0);
        setTargetElement(null);
        setPausedAt(null);
        props.onEnd?.();
    }

    const pause = () => {
        const step = current;
        if (step === 0) {
            return console.warn("First start the tutorial in order to pause it.");
        }

        writeStep(0);
        setTargetElement(null);
        setPausedAt(step);
    }

    const resume = (next: boolean = false) => {
        const resumeStep = pausedAt();
        if (!resumeStep) {
            return console.warn("No paused tutorial to resume.");
        }

        if (resumeStep >= count()) {
            console.warn("Paused step is beyond the last step. Resetting.");
            setPausedAt(null);
            return;
        }

        setPausedAt(null);
        changeStep(next ? resumeStep + 1 : resumeStep);
    }

    // Clamps provided step to valid range (1 to total step count)
    const constraintStep = (step: number) => clamp(step, 1, count());

    // Sets the current step after constraining it to valid range
    const changeStep = (step: number) => writeStep(constraintStep(step));

    // Advances to the next step in the tour
    const nextStep = () => {
        writeStep(constraintStep(current + 1));
    }

    // Returns to the previous step in the tour
    const previousStep = () => {
        writeStep(constraintStep(current - 1));
    }

    // Current progress as a percentage (0-100)
    const progress = createMemo(() => {
        const steps = count();
        if (steps <= 0) return 0;
        return Number((currentStep() / steps * 100).toFixed(2))
    })

    createEffect(() => targetElement(), (target) => {
        if (!target) return;

        const elementHasLoaded = target.offsetHeight && target.offsetWidth;
        waitForFrames(() => {
            const rect = target.getBoundingClientRect();
            let finalTop = rect.top;
            let finalHeight = rect.height;

            let scrollableParent = getScrollableParent(target);
            if (scrollableParent) {
                const parentRect = scrollableParent.getBoundingClientRect();
                let newScrollTop = scrollableParent.scrollTop;
                let dispatchScroll = true;

                if (rect.height > parentRect.height) {
                    finalHeight = parentRect.height;
                    dispatchScroll = false
                } else if (rect.bottom > parentRect.height) {
                    // Scroll to bottom of the target
                    newScrollTop = scrollableParent.scrollHeight - target.offsetTop;
                    const scrollDelta = newScrollTop - scrollableParent.scrollTop;
                    finalTop = rect.top - scrollDelta;
                } else if (scrollableParent.scrollTop > rect.bottom) {
                    // Scroll up so target is visible again
                    newScrollTop = rect.top;
                    finalTop = parentRect.top + rect.top;
                }
                scrollableParent.scrollTop = newScrollTop;
                if (dispatchScroll) scrollableParent.dispatchEvent(new CustomEvent('property-scroll'));
            }

            // Current values, read on purpose without tracking (this can run inside the effect when no frames are awaited).
            const rectOutset = untrack(outset) ?? initialOutset;

            const nextRect: HighlightRect = {
                top: finalTop - rectOutset,
                left: rect.left - rectOutset,
                width: rect.width + rectOutset * 2,
                height: finalHeight + rectOutset * 2,
            };
            const { left, top, width, height } = nextRect;
            setTutorialStyles({
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`
            });
        }, !elementHasLoaded ? 3 : 0)
    });

    const ctxObject: TutorialContextType = {
        current: currentStep,
        setTarget: setTargetElement,
        setCount,
        nextStep,
        previousStep,
        setTooltipData,
        initialRender,
        setInitialRender,
        setOutset,
        exit,
        progress
    }

    return (
        <TutorialContext value={ctxObject}>
            {props.children}
            <Portal>
                <div
                    class={[styles.tutorial, targetElement() && styles['tutorial-visible'], props.class]}
                    style={{ ...tutorialStyles(), ...props.style }}
                    ref={[
                        exposeRef<Omit<TutorialRef, 'element'>>(props, {
                            progress,
                            current: currentStep,
                            target: targetElement,
                            tour,
                            exit,
                            pause,
                            resume,
                            next: nextStep,
                            previous: previousStep,
                            changeStep: changeStep
                        }),
                        baseComponent(props),
                        navigationActions({
                            anchor: props.anchor,
                            ...props.onAction,
                        }),
                    ]}>
                </div>
                <Show when={targetElement()}>
                    <div class={styles.overlay}></div>
                </Show>
                <div class={styles['tooltip-reference']} style={tutorialStyles()}>
                    <TutorialTooltip
                        userTooltip={props.tooltip}
                        tooltipData={tooltipData}
                        progress={progress} />
                </div>
            </Portal>
        </TutorialContext>
    );
};

export default Object.assign(Tutorial, { Step });