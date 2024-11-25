import BaseComponent from "../BaseComponent/BaseComponent";
import { ParentProps, Component, ParentComponent, JSX, For, children, createContext, createSignal  } from "solid-js";
import GridTile from "../GridTile/GridTile";
import Events from "../types/BaseComponent";
import styles from './Grid.module.css';
import assignEventHandlers from "../utils/assignEventHandlers";

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


interface GridProps extends ParentProps, Omit<Events, ExcludedEvents> {
    style?: {}
    class?: {}
    rows: Required<number>
    cols: Required<number>
}

type GridContextType = {
    placeTile: (row: number, col: number, content: JSX.Element) => void;
};

export const GridContext = createContext<GridContextType>();

const Grid: ParentComponent<GridProps> = (props) => {
    const { GFUI, log, events } = BaseComponent(props);
    const eventHandlers = assignEventHandlers(events);
    const classes = `${styles.Grid} ${props.class || ""}`.trim();
    const inlineStyles = {
        ...props.style
    }

    const initialGrid  = Array.from({ length: props.rows }, () => Array.from({length: props.cols}, () => null))
    const [gridTiles, setGridTiles] = createSignal<(JSX.Element | null)[][]>(initialGrid);

    const placeTile = (row: number, col: number, content: JSX.Element) => {
        setGridTiles((prev) => {
            const updatedGrid = prev.map((r) => [...r]);
            if(row < props.rows && col < props.cols){
                updatedGrid[row][col] = content
            }
            return updatedGrid;
        })
    }

    return (
        <GridContext.Provider value={{placeTile}}>
            {/* Neccessary to call props.children because gridTile won't mount */}
            {props.children}
            <div {...eventHandlers} class={classes} style={inlineStyles}>
                <For each={gridTiles()}>
                    {(row) => (
                        <div class={styles['Grid-Row']}>
                            <For each={row}>{(cell) => 
                                <div class={styles['Grid-Col']}>
                                    {cell || <div class={styles['Grid-Empty-Cell']}></div>}
                                </div>
                            }</For>
                        </div>
                    )}
                </For>
            </div>
        </GridContext.Provider>
    );
}

export default Grid;

