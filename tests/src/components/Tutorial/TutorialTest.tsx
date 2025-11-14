import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import selectors from "../../../shared/tutorial/tutorial-selectors.json";
import events from '../../../shared/tutorial/tutorial-events.json';
import steps from '../../../shared/tutorial/tutorial-steps.json';
import Tutorial, { TutorialRef } from "@components/Complex/Tutorial/Tutorial";
import Flex from "@components/Layout/Flex/Flex";
import Image from "@components/Media/Image/Image";
import GamefaceUIImage from './coherent-gameface-ui.png';
import { TooltipType } from "@components/Complex/Tutorial/TutorialTooltip";
import './tutorial.css'
import Progress from "@components/Feedback/Progress/Progress";

const TestTooltip: TooltipType = (props) => {
    return (
        <div class={selectors.tooltip}>
            <div class={selectors['tooltip-title']}>{props.title}</div>
            <div class={selectors['tooltip-content']}>{props.content}</div>
            <Progress.Bar class={selectors['tooltip-progress']} progress={props.progress()}>
                <Progress.Bar.Fill class={selectors['tooltip-progress-fill']} />
            </Progress.Bar>
            <Flex>
                <props.Prev class={selectors['tooltip-prev']}>Prev</props.Prev>
                <props.Next class={selectors['tooltip-next']}>Next</props.Next>
            </Flex>
        </div>
    )
}

const TutorialTest = () => {
    let tutorialRef!: TutorialRef;
    const [test, setTest] = createSignal('red');
    const [dynamicElement, setDynamicElement] = createSignal(false);
    const [currentStep, setCurrentStep] = createSignal(0);

    const scenarios = [
        { label: events.start, action: () => tutorialRef?.tour() },
        { label: events.end, action: () => tutorialRef?.exit() },
        { label: events.pause, action: () => tutorialRef?.pause() },
        { label: events.resume, action: () => tutorialRef?.resume() },
        { label: events['resume-from-next'], action: () => tutorialRef?.resume(true) },
        { label: events['dynamic-element'], action: () => setDynamicElement(true) },
        { label: events['change-styles'], action: () => setTest('blue') },
    ];

    const reset = () => {
        setTest('red');
        setDynamicElement(false);
        setCurrentStep(0);
        tutorialRef?.exit();
    };

    const handleChangeStep = (event: CustomEvent<{step: number}>) => {
        tutorialRef?.changeStep(event.detail.step);
    } 

    const isReactive = createMemo(() => test() === 'blue');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => {
        document.addEventListener('reset', reset);
        document.addEventListener(events['change-step'], handleChangeStep as EventListener)

        // attach all listeners
        scenarios.forEach(({ label, action }) => {
            document.addEventListener(label, action);
        });

        onCleanup(() => {
            document.removeEventListener('reset', reset);
            scenarios.forEach(({ label, action }) => {
                document.removeEventListener(label, action);
            });
        });
    });


    return (
        <Tab location='tutorial'>
            <div class={selectors.assertionElement}>{currentStep()}</div>

            <Flex justify-content="start" align-items="center" wrap="wrap" style={{"max-width": '30vw'}}>
                <For each={scenarios}>
                    {(sc, i) => (
                        <button data-event={sc.label} onClick={sc.action} >
                            {sc.label}
                        </button>
                    )}
                </For>
            </Flex> 

            <Tutorial 
                ref={tutorialRef} 
                outset={0}
                class={`${selectors.tutorial} ${reactiveClass()}`}
                style={reactiveStyle()}
                onChange={(step) => setCurrentStep(step)}
                tooltip={TestTooltip}>
                <div class={selectors["card-wrapper"]}>
                    <Tutorial.Step order={steps[0].order} title={steps[0].title} content={steps[0].content}>
                        <div class={selectors.card}>
                            <Tutorial.Step order={steps[1].order} title={steps[1].title} content={steps[1].content} position={steps[1].position as any}>
                                <Image class={selectors["card-image"]} src={GamefaceUIImage}></Image>
                            </Tutorial.Step>
                            <Tutorial.Step order={steps[2].order} title={steps[2].title} content={steps[2].content} position={steps[2].position as any}>
                                <div class={selectors["card-content"]}>
                                    <Tutorial.Step order={steps[3].order} title={steps[3].title} content={steps[3].content} position={steps[3].position as any}>
                                        <h1 class={selectors["card-heading"]}>This is gameface UI!</h1>
                                    </Tutorial.Step>
                                    <Tutorial.Step order={steps[4].order} title={steps[4].title} content={steps[4].content} position={steps[4].position as any}>
                                        <div class={selectors["card-text"]}>
                                            GamefaceUI is a comprehensive collection of components designed to simplify the prototyping of game user interfaces.
                                            <Show when={dynamicElement()}>
                                            {/* Not adding dynamic step to the json to keep length predictable */}
                                                <Tutorial.Step order={6} title="Step 6" content="Dynamic step">
                                                    <div>Dynamic element</div>
                                                </Tutorial.Step>
                                            </Show>
                                        </div>
                                    </Tutorial.Step>
                                </div>
                            </Tutorial.Step>
                        </div>
                    </Tutorial.Step>
                </div>
            </Tutorial>
        </Tab>
    )
}

export default TutorialTest;