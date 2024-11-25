import BaseComponent from "../BaseComponent/BaseComponent";
import { ParentProps, Component, ParentComponent, JSX, For, children, createContext, useContext, onMount  } from "solid-js";
import Events from "../types/BaseComponent";
import assignEventHandlers from "../utils/assignEventHandlers";
import styles from './GridTile.module.css'
import { GridContext } from "../Grid/Grid";

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

interface GridTileProps extends ParentProps, Omit<Events, ExcludedEvents> {
    style?: {}
    class?: {}
    row: number
    col: number
}

const GridTile: ParentComponent<GridTileProps> = (props) => {
    const { GFUI, log, events } = BaseComponent(props);
    const eventHandlers = assignEventHandlers(events);
    const classes = `${styles.GridTile} ${props.class || ""}`.trim();
    const inlineStyles = {
        ...props.style
    }

    const context = useContext(GridContext)

    if (!context) {
        throw new Error("GridTile component must be used within a Grid component");
    }

    const { placeTile } = context;

    const tileContent = (
        <div {...eventHandlers} class={classes} style={inlineStyles}>{props.children}</div>
    )
    
    placeTile(props.row - 1, props.col - 1, tileContent);

    return null
}

export default GridTile;

