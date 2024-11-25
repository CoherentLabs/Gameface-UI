import BaseComponent from "../BaseComponent/BaseComponent";
import { ParentProps, Component, ParentComponent, JSX  } from "solid-js";
import Events from "../types/BaseComponent";
import styles from './Content.module.css';
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

interface ContentProps extends ParentProps, Omit<Events, ExcludedEvents> {
    style?: {}
    class?: {}
}

const Content: ParentComponent<ContentProps> = (props) => {
    const { GFUI, log, events } = BaseComponent(props);
    const eventHandlers = assignEventHandlers(events);
    const classes = `${styles.Content} ${props.class || ""}`.trim();
    const inlineStyles = {
        ...props.style
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

export default Content;