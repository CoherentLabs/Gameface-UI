import BaseComponent from "../BaseComponent/BaseComponent";
import { ParentProps, Component, ParentComponent, JSX  } from "solid-js";
import Events from "../types/BaseComponent";
import styles from './Layout.module.css';
import extractEvents from "../utils/extractEvents";

interface LayoutProps extends ParentProps, Events {
    style?: {}
}

const excludedEventsSet = new Set([
    "abort",
    "durationchange",
    "ended",
    "finish",
    "gamepadconnected",
    "gamepaddisconnected",
    "readystatechange",
    "timeout",
    "transitionend",
    "volumechange",
    "wheel",
]);

const Layout: ParentComponent<LayoutProps> = (props) => {
    const { GFUI, log, events } = BaseComponent(props);
    const eventHandlers = extractEvents(events, excludedEventsSet);

    return (
        <div 
            {...eventHandlers}
            style={{...props.style}}
            >
                {props.children}
        </div>
    )
}

export default Layout;