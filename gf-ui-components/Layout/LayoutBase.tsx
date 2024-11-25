import BaseComponent from "../BaseComponent/BaseComponent";
import { ParentProps, Component, ParentComponent, JSX, useContext  } from "solid-js";
import Events from "../types/BaseComponent";
import styles from './Layout.module.css';
import assignEventHandlers from "../utils/assignEventHandlers";
import LayoutBaseProps from "../types/LayoutBase";
import { GridContext } from "./Grid/Grid";

interface LayoutBaseComponentProps extends LayoutBaseProps {
    componentStyles?: JSX.CSSProperties,
    componentClasses?: string
}

const LayoutBase: ParentComponent<LayoutBaseComponentProps> = (props) => {
    const { GFUI, log, events } = BaseComponent(props);
    const eventHandlers = assignEventHandlers(events);
    const classes = `${props.componentClasses} ${props.class || ""}`.trim();
    const inlineStyles = {
        ...(props.style || {}),
        ...(props.componentStyles || {})
    }
    
    return (
        <div {...eventHandlers} class={classes} style={inlineStyles}>
            {props.children}
        </div>
    )
}

export default LayoutBase;