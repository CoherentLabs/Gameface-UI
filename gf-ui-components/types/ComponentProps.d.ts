import { JSX } from "solid-js";
import ComponentBaseProps from "./LayoutBase";
import { refElementType } from "../BaseComponent/BaseComponent";

export interface BasicBaseRef {
    element: refElementType;
}

export interface ComponentProps<T extends Record<string, any> = {}> extends ComponentBaseProps {
    componentStyles?: JSX.CSSProperties,
    componentClasses?: string
    ref?: unknown | ((ref: BasicBaseRef & T) => void);
    refObject?: T;
}


declare module "solid-js" {
    namespace JSX {
        interface IntrinsicElements {
            p: JSX.HTMLAttributes<HTMLParagraphElement> & { cohinline?: any };
        }
    }
}