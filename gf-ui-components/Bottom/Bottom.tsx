import BaseComponent from "../BaseComponent/BaseComponent";
import { ParentProps, Component, ParentComponent, JSX  } from "solid-js";
import Events from "../types/BaseComponent";
import styles from './Bottom.module.css';
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

interface BottomProps extends ParentProps, Omit<Events, ExcludedEvents> {
    style?: {}
    class?: {}
}

const Bottom: ParentComponent<BottomProps> = (props) => {
    const { GFUI, log, events } = BaseComponent(props);
    const eventHandlers = assignEventHandlers(events);
    const classes = `${styles.Bottom} ${props.class || ""}`.trim();
    const inlineStyles = {
        ...props.style
    }

    return (
        <div 
            {...eventHandlers}
            style={inlineStyles}
            class={classes}
            >
                {props.children}
        </div>
    )
}

export default Bottom;