import { JSX, ParentComponent, ParentProps } from "solid-js";
import styles from './ScrollHandle.module.css';

export interface HandleSlotProps extends ParentProps {
    style?: JSX.CSSProperties
    class?: string,
}

interface ScrollHandleProps {
    style: JSX.CSSProperties | undefined
    handleSlot?: HandleSlotProps
    mouseDown: (e: MouseEvent) => void
}

const ScrollHandle: ParentComponent<ScrollHandleProps> = (props) => {
    if (props.handleSlot) {
        return <div
            onMouseDown={props.mouseDown}
            class={styles.Handle + ' ' + props.handleSlot?.class || ''}
            style={{ ...props.style, ...(props.handleSlot?.style) || {} }}>
            {props.handleSlot?.children}
        </div>
    }

    return (
        <div
            onMouseDown={props.mouseDown}
            class={styles.Handle}
            style={{ ...props.style }}>
        </div>
    )
}

export default ScrollHandle;