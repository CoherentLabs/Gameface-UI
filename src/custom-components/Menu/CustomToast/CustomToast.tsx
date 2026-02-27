import { batch, JSX, onCleanup, onMount } from "solid-js"
import styles from './CustomToast.module.scss';
import { useNavigation } from "@components/Utility/Navigation/Navigation";
import Progress from "@components/Feedback/Progress/Progress";
import CustomButton from "../CustomButton/CustomButton";

interface CustomToastProps {
    close: (children?: JSX.Element) => JSX.Element;
    progress: () => number,
    dismiss: () => void,
    action: () => void;
}

const CustomToast = (props: CustomToastProps) => {
    const nav = useNavigation();

    onMount(() => {
        batch(() => {
            nav?.addAction('start-tutorial', {
                key: { binds: ['ENTER'], type: ['press'] },
                button: { binds: ['face-button-down'], type: 'press' },
                callback: () => {
                    props.action();
                    props.dismiss();
                }
            })
            nav?.addAction('dismiss', {
                key: { binds: ['ESC'], type: ['press'] },
                button: { binds: ['face-button-right'], type: 'press' },
                callback: props.dismiss
            })
        })
    });
    
    onCleanup(() => {
        batch(() => {
            nav?.removeAction('start-tutorial')
            nav?.removeAction('dismiss')
        })
    })
    
    return (
        <>
            <div class={styles.toast}>
                Start Tutorial?
                <div class={styles['toast-button-container']}>
                    {props.close(<CustomButton text="Start" variation="select" handler={props.action} />)}
                    {props.close(<CustomButton text="Skip" variation="back" />)}
                </div>
                <Progress.Bar class={styles['toast-progress']} progress={props.progress() * 5}>
                    <Progress.Bar.Fill class={styles['toast-progress-fill']} />
                </Progress.Bar>
            </div>
        </>
    )
}

export default CustomToast;