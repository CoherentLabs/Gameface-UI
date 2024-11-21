import BaseComponent from "../BaseComponent/BaseComponent";
import { ParentProps, Component, ParentComponent, JSX  } from "solid-js";
import Events from "../types/BaseComponent";
import extractEvents from "../utils/extractEvents";
import styles from './Row.module.css';

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

interface RowProps extends JSX.HTMLAttributes<HTMLDivElement>, Events {
  style?: {}
}

const Row: Record<string, (props: RowProps) => JSX.Element> = {};

for (let i = 1; i <= 12; i++) {
  const height = (i * 100) / 12;
  const componentName = `Row${i}`;

  Row[componentName] = (props: RowProps) => {
    const { GFUI, log, events } = BaseComponent(props);
    const eventHandlers = extractEvents(events, excludedEventsSet);


    const styles = {
      ...props.style,
      height: `${height}vh`,
    };

    return (
      <div {...eventHandlers} style={styles}>
        {props.children}
      </div>
    );
  };
}

export const Row1 = Row.Row1;
export const Row2 = Row.Row2;
export const Row3 = Row.Row3;
export const Row4 = Row.Row4;
export const Row5 = Row.Row5;
export const Row6 = Row.Row6;
export const Row7 = Row.Row7;
export const Row8 = Row.Row8;
export const Row9 = Row.Row9;
export const Row10 = Row.Row10;
export const Row11 = Row.Row11;
export const Row12 = Row.Row12;
export default Row;