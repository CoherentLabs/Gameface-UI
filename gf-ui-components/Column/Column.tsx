import BaseComponent from "../BaseComponent/BaseComponent";
import { ParentProps, Component, ParentComponent, JSX  } from "solid-js";
import Events from "../types/BaseComponent";
import assignEventHandlers from "../utils/assignEventHandlers";
import styles from './Column.module.css';

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
    
interface ColumnProps extends ParentProps, Omit<Events, ExcludedEvents> {
    style?: {}
    class?: {}
}

const Column: Record<string, (props: ColumnProps) => JSX.Element> = {};

for (let i = 1; i <= 12; i++) {
  const componentName = `Column${i}`;

  Column[componentName] = (props: ColumnProps) => {
    const { GFUI, log, events } = BaseComponent(props);
    const eventHandlers = assignEventHandlers(events);
    const classes = `${styles[`Column-${i}`]} ${props.class || ""}`.trim();
    const inlineStyles = {
      ...props.style,
    };

    return (
      <div {...eventHandlers} style={inlineStyles} class={classes}>
        {props.children}
      </div>
    );
  };
}

export const Column1 = Column.Column1;
export const Column2 = Column.Column2;
export const Column3 = Column.Column3;
export const Column4 = Column.Column4;
export const Column5 = Column.Column5;
export const Column6 = Column.Column6;
export const Column7 = Column.Column7;
export const Column8 = Column.Column8;
export const Column9 = Column.Column9;
export const Column10 = Column.Column10;
export const Column11 = Column.Column11;
export const Column12 = Column.Column12;
export default Column;