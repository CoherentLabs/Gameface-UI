import BaseComponent from "../BaseComponent/BaseComponent";
import { ParentProps, Component, ParentComponent, JSX  } from "solid-js";
import Events from "../types/BaseComponent";
import styles from './Relative.module.css';
import assignEventHandlers from "../utils/assignEventHandlers";

type ExcludedEvents = 
    | "abort"
    | "animationend"
    | "durationchange"
    | "ended"
    | "finish"
    | "gamepadconnected"
    | "gamepaddisconnected"
    | "readystatechange"
    | "timeout"
    | "transitionend"
    | "volumechange"
    | "wheel";

interface LayoutProps extends ParentProps, Omit<Events, ExcludedEvents> {
    style?: JSX.CSSProperties
    class?: string
    top?: string,
    left?: string,
    right?: string,
    bottom?: string,
}

const Relative: ParentComponent<LayoutProps> = (props) => {
    const { GFUI, log, events } = BaseComponent(props);
    const eventHandlers = assignEventHandlers(events);
    const classes = `${styles.Relative} ${props.class || ""}`.trim();
    const inlineStyles = {
        ...(props.style || {}),
        ...(props.top !== undefined ? { top: props.top } : {}),
        ...(props.left !== undefined ? { left: props.left } : {}),
        ...(props.right !== undefined ? { right: props.right } : {}),
        ...(props.bottom !== undefined ? { bottom: props.bottom } : {}),
    }

    return (
        <div 
            {...eventHandlers}
            class={classes}
            style={inlineStyles}
            >
                {props.children}
        </div>
    )
}

export default Relative;