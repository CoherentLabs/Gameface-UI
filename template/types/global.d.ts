declare module "solid-js" {
    namespace JSX {
        interface IntrinsicAttributes {
            "data-bind-value"?: string;
            "data-bind-if"?: string;
            "data-bind-class"?: string;
            "data-bind-class-toggle"?: string;
            "data-bind-style"?: string;
            "data-bind-style-left"?: string;
            "data-bind-style-top"?: string;
            "data-bind-style-opacity"?: string;
            "data-bind-style-width"?: string;
            "data-bind-style-height"?: string;
            "data-bind-style-color"?: string;
            "data-bind-style-background-color"?: string;
            "data-bind-style-background-image-url"?: string;
            "data-bind-style-transform2d"?: string;
            "data-bind-style-transform-rotate"?: string;
            "data-bind-html"?: string;
            [key: `data-bind-${string}`]: string | undefined;

            // Event Binding Attributes
            "data-bind-abort"?: string;
            "data-bind-blur"?: string;
            "data-bind-click"?: string;
            "data-bind-dblclick"?: string;
            "data-bind-error"?: string;
            "data-bind-focus"?: string;
            "data-bind-focusin"?: string;
            "data-bind-focusout"?: string;
            "data-bind-keydown"?: string;
            "data-bind-keypress"?: string;
            "data-bind-keyup"?: string;
            "data-bind-load"?: string;
            "data-bind-mousedown"?: string;
            "data-bind-mouseover"?: string;
            "data-bind-mouseout"?: string;
            "data-bind-mouseenter"?: string;
            "data-bind-mouseleave"?: string;
            "data-bind-mousemove"?: string;
            "data-bind-mouseup"?: string;
            "data-bind-input"?: string;
            "data-bind-change"?: string;
            "data-bind-scroll"?: string;
            "data-bind-touchstart"?: string;
            "data-bind-touchend"?: string;
            "data-bind-resize"?: string;
            "data-bind-durationchange"?: string;
            "data-bind-emptied"?: string;
            "data-bind-ended"?: string;
            "data-bind-seeked"?: string;
            "data-bind-seeking"?: string;
            "data-bind-timeupdate"?: string;
            "data-bind-wheel"?: string;
        }
    }
}


export { };

