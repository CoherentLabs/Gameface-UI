import { JSX, ParentProps } from "solid-js";
import Events from "./BaseComponent";

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

export default interface LayoutBaseProps extends ParentProps, Omit<Events, ExcludedEvents> {
    style?: JSX.CSSProperties
    class?: string,
}