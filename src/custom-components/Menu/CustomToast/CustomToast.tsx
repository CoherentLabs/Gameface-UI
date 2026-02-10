import { createMemo, createSignal, JSX, onCleanup, onMount, useContext } from "solid-js"
import styles from './CustomToast.module.scss';
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { useNavigation } from "@components/Utility/Navigation/Navigation";
import Flex from "@components/Layout/Flex/Flex";
import { Icon } from "@components/Media/Icon/Icon";
import { MenuContext } from "../../../views/menu/Menu";
import Progress from "@components/Feedback/Progress/Progress";

interface CustomToastProps {
    close: (children?: JSX.Element) => JSX.Element;
    progress: () => number,
    dismiss: () => void,
    action: () => void;
}

const CustomToast = (props: CustomToastProps) => {
    let el: HTMLDivElement | undefined;
    const { navigationActions } = useBaseComponent({});
    const nav = useNavigation();
    const menuContext = useContext(MenuContext)

    onMount(() => el?.focus());
    onCleanup(() => nav?.focusFirst('menu'))

    return (
        <>
            <div class={styles.toast}>
                Start Tutorial?
                <div ref={el} class={styles['toast-button-container']} use:navigationActions={{
                    'select': () => {
                        props.action();
                        props.dismiss();
                    },
                    'back': props.dismiss
                }}>
                    {props.close(
                        <Flex direction="row" align-items="center" class={styles['toast-button']} click={props.action}>
                            {menuContext?.inputType() === 'gamepad' 
                                ? <Icon.gamepad.xbox.a class={styles['toast-button-icon']} />
                                : <div class={styles['toast-button-key']}>Enter</div>
                            }
                            <div>Start</div>
                        </Flex>
                    )}
                    {props.close(
                        <Flex direction="row" align-items="center" class={styles['toast-button']}>
                            {menuContext?.inputType() === 'gamepad' 
                                ? <Icon.gamepad.xbox.b class={styles['toast-button-icon']} />
                                : <div class={styles['toast-button-key']}>ESC</div>
                            }
                            <div>Skip</div>
                        </Flex>
                    )}
                </div>
                <Progress.Bar class={styles['toast-progress']} progress={props.progress() * 5}>
                    <Progress.Bar.Fill class={styles['toast-progress-fill']} />
                </Progress.Bar>
            </div>
        </>
    )
}

export default CustomToast;