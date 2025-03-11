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

export type refElementType = HTMLParagraphElement | HTMLDivElement | HTMLButtonElement | undefined;

export interface BaseComponentRef {
    element: refElementType;
}

export interface ComponentBaseProps extends ParentProps, Omit<Events, ExcludedEvents> {
    style?: JSX.CSSProperties
    class?: string,
}

export interface ComponentProps<T extends Record<string, any> = {}> extends ComponentBaseProps {
    componentStyles?: JSX.CSSProperties,
    componentClasses?: string
    ref?: unknown | ((ref: BaseComponentRef & T) => void);
    refObject?: T;
    active?: string;
}

declare module "solid-js" {
    namespace JSX {
        interface IntrinsicElements {
            p: JSX.HTMLAttributes<HTMLParagraphElement> & { cohinline?: any };
        }
    }
}