import { TooltipType } from "@components/Complex/Tutorial/TutorialTooltip"
import styles from './CustomTooltip.module.scss'
import Progress from "@components/Feedback/Progress/Progress"
import Flex from "@components/Layout/Flex/Flex"
import { createMemo, Show, useContext } from "solid-js"
import { TutorialRef } from "@components/Complex/Tutorial/Tutorial"
import { TutorialSteps } from "../../../views/menu/util/tutorialSteps"
import { MenuContext } from "../../../views/menu/Menu"

interface CustomTooltipProps {
    api: TutorialRef,
    some: number,
}

const CustomTooltip: TooltipType<CustomTooltipProps> = (props) => {
    const context = useContext(MenuContext);

    const conditionalClasses = createMemo(() => {
        const classes: string[] = [styles.tooltip];

        switch (props.step()) {
            case TutorialSteps.Intro.order:
            case TutorialSteps.End.order:
                classes.push(styles['top-offset']);
                break;
            case TutorialSteps.Structure.order:
                classes.push(styles.wider)
                break;
            case TutorialSteps.Interactive.order:
                classes.push(styles.interactive)
                break;
        }

        return classes.join(' ');
    })

    // Show buttons UNLESS we're on Interactive step AND tutorial hasn't been completed yet
    const shouldShowButtons = () => {
        const isInteractiveStep = props.step() === TutorialSteps.Interactive.order;
        const tutorialCompleted = context?.interactiveTutorials().subtitles;

        const isInteractiveStepTwo = props.step() === TutorialSteps.InteractiveTwo.order
        const secondTutorialCompleted = context?.interactiveTutorials().color;

        if (isInteractiveStep) return tutorialCompleted
        if (isInteractiveStepTwo) return secondTutorialCompleted

        return true;
    }

    const NextButton = () => {
        const changeActiveItem = () => {
            if (props.step() === TutorialSteps.InteractiveTwo.order - 1) {
                context?.setCurrentOption("subtitleColor")
            }
        }

        return <props.Next click={changeActiveItem} class={styles['tooltip-control']}>
            {props.progress() === 100 ? "Done" : "Next" }
        </props.Next>
    }

    return (
        <div class={conditionalClasses()}>
            <h2 class={styles['tooltip-heading']}>{props.title}</h2>
            <span class={styles['tooltip-content']}>{props.content}</span>
            <Progress.Bar class={styles['tooltip-progress']} style={{width: '100%'}} progress={props.progress()}>
            </Progress.Bar>
            <Show when={shouldShowButtons()}>
                <Flex>
                    <props.Prev 
                        class={`${styles['tooltip-control']} 
                        ${styles['tooltip-control-first']} 
                        ${props.step() === 1 ? styles['tooltip-control-disabled'] : ''}`}>
                        Prev
                    </props.Prev>
                    <NextButton />
                </Flex>
            </Show>
            <div class={styles['tooltip-exit']} onclick={props.api?.exit}>x</div>
        </div>
    )
}

export default CustomTooltip;