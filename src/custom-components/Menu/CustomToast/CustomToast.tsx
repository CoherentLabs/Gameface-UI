import { JSX } from "solid-js"
import styles from './CustomToast.module.scss';

interface CustomToastProps {
    close: (children?: JSX.Element) => JSX.Element;
    action: () => void;
}

const CustomToast = (props: CustomToastProps) => {
    return (
        <div class={styles.toast}>
            Start Tutorial?
            <div class={styles['toast-button-container']}>
                {props.close(<button class={styles['toast-button']} onclick={props.action}>Start</button>)}
                {props.close(<button class={styles['toast-button']}>Skip</button>)}
            </div>
        </div>
    )
}

export default CustomToast;