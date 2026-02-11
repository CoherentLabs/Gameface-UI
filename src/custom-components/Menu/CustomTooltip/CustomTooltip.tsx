import { TooltipType } from "@components/Complex/Tutorial/TutorialTooltip"
import styles from './CustomTooltip.module.scss'
import Progress from "@components/Feedback/Progress/Progress"
import Flex from "@components/Layout/Flex/Flex"
import { createMemo, Show, useContext } from "solid-js"
import { TutorialRef } from "@components/Complex/Tutorial/Tutorial"
import { TutorialSteps } from "../../../views/menu/util/tutorialSteps"
import { MenuContext } from "../../../views/menu/Menu"
import CustomButton from "../CustomButton/CustomButton"

interface CustomTooltipProps {
    exit: () => void;
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
        const tutorialCompleted = TutorialSteps.Interactive.completed

        const isInteractiveStepTwo = props.step() === TutorialSteps.InteractiveTwo.order
        const secondTutorialCompleted = TutorialSteps.InteractiveTwo.completed;

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
            <CustomButton text={props.progress() === 100 ? "Done" : "Next" } variation="select" />
        </props.Next>
    }

    return (
        <div class={conditionalClasses()}>
            <h2 class={styles['tooltip-heading']}>{props.title}</h2>
            <span class={styles['tooltip-content']}>{props.content}</span>
            <Progress.Bar class={styles['tooltip-progress']} progress={props.progress()} />
            <Show when={shouldShowButtons()}>
                <Flex>
                    <props.Prev 
                        class={`${styles['tooltip-control']} 
                        ${styles['tooltip-control-first']} 
                        ${props.step() === 1 ? styles['tooltip-control-disabled'] : ''}`}>
                        <CustomButton text={"Prev"} variation="back" />
                    </props.Prev>
                    <NextButton />
                </Flex>
            </Show>
            <div class={styles['tooltip-exit']} onclick={props.exit}>x</div>
        </div>
    )
}

export default CustomTooltip;