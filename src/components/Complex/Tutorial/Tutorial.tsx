import { Accessor, children, Component, createContext, createEffect, createMemo, createSignal, For, JSX, onMount, ParentComponent, Setter, Show, untrack } from "solid-js";
import { ComponentProps } from "@components/types/ComponentProps";
import Step from "./Step";
import styles from './Tutorial.module.scss';
import { Portal } from "solid-js/web";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import TutorialTooltip, { ToolTipData, TooltipType } from "./TutorialTooltip";
import { clamp } from "@components/utils/clamp";
import getScrollableParent from "@components/utils/getScrollableParent";

export type HighlightRect = Omit<DOMRect, 'bottom' | 'right' | 'x' | 'y' | 'toJSON'>;

interface TutorialProps<T extends Record<string, any> = {}> extends ComponentProps {
    outset?: number
    tooltip?: TooltipType<T>
    onChange?: (step: number) => void,
}

interface TutorialContextType {
    current: Accessor<number>,
    setTarget: Setter<HTMLElement | null>
    setCount: Setter<number>,
    nextStep: () => void,
    previousStep: () => void,
    setTooltipData: Setter<ToolTipData>,
    initialRender: Accessor<boolean>,
    setInitialRender: Setter<boolean>
}
export const TutorialContext = createContext<TutorialContextType>();

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
    resume: () => void,
    changeStep: (step: number) => void,
}

function Tutorial<T extends Record<string, any> = {}>(props: TutorialProps<T>): JSX.Element {
    let element: HTMLDivElement | undefined;

    const [currentStep, setCurrentStep] = createSignal(0);
    const [pausedAt, setPausedAt] = createSignal<number | null>(null);
    const [initialRender, setInitialRender] = createSignal(true);
    const [targetElement, setTargetElement] = createSignal<HTMLElement | null>(null);
    const [highlightRect, setHighlightRect] = createSignal<HighlightRect | null>(null);
    const [tutorialStyles, setTutorialStyles] = createSignal<JSX.CSSProperties>({});
    const [tooltipData, setTooltipData] = createSignal<ToolTipData>({});
    const [count, setCount] = createSignal(0);

    // Starts the tour from the specified step (defaults to step 1)
    const tour = (from?: number) => {
        if (currentStep() !== 0) {
            return console.warn("Trying to start a new tour while another one is already in progress.");
        }
        setCurrentStep(changeStep(from || 1))
    };
    
    // Cancels the tour and resets to initial state
    const exit = () => {
        setCurrentStep(0);
        setTargetElement(null);
        setPausedAt(null);
    }

    const pause = () => {
        const current = currentStep();
        if (current === 0) {
            return console.warn("First start the tutorial in order to pause it.");
        }

        if (current === count()) {
            return console.warn("Cannot pause on the last step. The tour is complete.");
        }

        setCurrentStep(0);
        setTargetElement(null);
        setPausedAt(current);
    }

    const resume = () => {
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
        tour(resumeStep);
    }
    
    // Clamps provided step to valid range (1 to total step count)
    const constraintStep = (step: number) => clamp(step, 1, count());
    
    // Sets the current step after constraining it to valid range
    const changeStep = (step: number) => setCurrentStep(constraintStep(step));
    
    // Advances to the next step in the tour
    const nextStep = () => {
        setCurrentStep(prev => constraintStep(prev + 1));
    }

    // Returns to the previous step in the tour
    const previousStep = () => {
        setCurrentStep(prev => constraintStep(prev - 1));
    }

    // Current progress as a percentage (0-100)
    const progress = createMemo(() => {
        const steps = count();
        if (steps <= 0) return 0;
        return Number((currentStep() / steps * 100).toFixed(2))
    })

    createEffect(() => {
        const target = targetElement();
        if (!target) return;

        const rect = target.getBoundingClientRect();
        let finalTop = rect.top;

        let scrollableParent = getScrollableParent(target);
        if (scrollableParent) {
            const parentRect = scrollableParent.getBoundingClientRect();
            let newScrollTop = scrollableParent.scrollTop;

            if ( rect.bottom > parentRect.height) {
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
            scrollableParent.dispatchEvent(new CustomEvent('property-scroll'));
        } 
        
        const outset = props.outset ?? 0;
        
        setHighlightRect({
            top: finalTop - outset,
            left: rect.left - outset,
            width: rect.width + outset * 2,
            height: rect.height + outset * 2,
        })

        setTutorialStyles(() => {
            const { left, top, width, height } = highlightRect()!;
            return {
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`
            }
        });

        props.onChange?.(currentStep())
    })
        
    const tutorialClasses = createMemo(() => {
        const classes = [styles.tutorial];
        targetElement() && classes.push(styles['tutorial-visible'])

        return classes.join(" ");
    })

    props.componentClasses = tutorialClasses;
    props.componentStyles = tutorialStyles;
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as (ref: TutorialRef) => void)({
            element,
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
        });
    });

    const ctxObject: TutorialContextType = {
        current: currentStep,
        setTarget: setTargetElement,
        setCount,
        nextStep,
        previousStep,
        setTooltipData,
        initialRender,
        setInitialRender
    }

    return (
        <TutorialContext.Provider value={ctxObject}>
            {props.children}
            <Portal>
                <div
                    ref={element}
                    class={className()}
                    style={inlineStyles()}
                    use:forwardEvents={props}
                    use:forwardAttrs={props}>
                </div>
                <Show when={targetElement()}>
                    <div class={styles.overlay}></div>
                </Show>
                <div class={styles['tooltip-reference']} style={tutorialStyles()}>
                    <TutorialTooltip 
                        userTooltip={props.tooltip}
                        tooltipData={tooltipData}
                        progress={progress}
                        exit={exit} />
                </div>
            </Portal>
        </TutorialContext.Provider>
    );
};

export default Object.assign(Tutorial, { Step });