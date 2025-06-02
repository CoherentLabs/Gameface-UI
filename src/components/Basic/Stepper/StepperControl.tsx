import { Accessor, createMemo, JSX, ParentComponent, ParentProps, Show, useContext } from "solid-js";
import styles from './Stepper.module.css';
import { TokenComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import StepperArrow from './StepperArrow.svg?component-solid';
import { StepperContext } from "./Stepper";
import Flex from "@components/Layout/Flex/Flex";
import Transform from "@components/Layout/Transform/Transform";

interface ControlTokenProps {
    style?: JSX.CSSProperties,
    class?: string,
    'hidden-class'?: string
}

export const Control = createTokenComponent<ControlTokenProps>();

interface StepperControlProps extends TokenComponentProps {
    visible: boolean
    direction: 'prev' | 'next'
}

const ControlComponent = ({ ControlToken }: { ControlToken: Accessor<ParentProps<ControlTokenProps> | null | undefined> }) => {
    return <>
        <Show when={ControlToken()?.children}>
            {ControlToken()?.children}
        </Show>
        <Show when={!ControlToken()?.children}>
            <StepperArrow class={styles.StepperArrow} />
        </Show>
    </>
}

export const StepperControl: ParentComponent<StepperControlProps> = (props) => {
    const stepperContext = useContext(StepperContext);
    const ControlToken = useToken(Control, props.parentChildren);

    const controlContainerClasses = createMemo(() => {
        const classes = [styles.StepperControl];

        if (ControlToken()?.class) classes.push(ControlToken()?.class ?? '');
        if (!props.visible) {
            if (ControlToken?.()?.["hidden-class"]) {
                classes.push(ControlToken?.()?.["hidden-class"] ?? '');
            } else {
                classes.push(styles.StepperControlHidden);
            }
        }

        return classes.join(' ');
    });

    return (
        <>
            <Flex align-items="center" direction="row"
                class={controlContainerClasses()}
                style={ControlToken()?.style || {}}
                click={() => stepperContext?.changeSelected(props.direction)}>
                <Show when={props.direction === 'prev'}>
                    <ControlComponent ControlToken={ControlToken} />
                </Show>
                <Show when={props.direction === 'next'}>
                    <Transform rotate={{ y: 180 }}>
                        <ControlComponent ControlToken={ControlToken} />
                    </Transform>
                </Show>
            </Flex>
        </>

    )
}
