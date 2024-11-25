import BaseComponent from "../BaseComponent/BaseComponent";
import { ParentProps, Component, ParentComponent, JSX  } from "solid-js";
import Events from "../types/BaseComponent";
import assignEventHandlers from "../utils/assignEventHandlers";
import styles from './Row.module.css';

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
    
interface RowProps extends ParentProps, Omit<Events, ExcludedEvents> {
    style?: {}
    class?: {}
}

const Row: ParentComponent<RowProps> = (props) => {
  const { GFUI, log, events } = BaseComponent(props);
  const eventHandlers = assignEventHandlers(events);
  const classes = `${styles.Row} ${props.class || ""}`.trim();
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

export default Row;