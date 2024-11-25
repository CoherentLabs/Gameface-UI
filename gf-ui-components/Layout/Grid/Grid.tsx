import { ParentProps, Component, ParentComponent, JSX, For, children, createContext, createSignal  } from "solid-js";
import styles from './Grid.module.css';
import LayoutBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";

interface GridProps extends LayoutBaseProps {
    rows: Required<number>
    cols: Required<number>
}

type GridContextType = {
    placeTile: (row: number, col: number, content: JSX.Element) => void;
};

export const GridContext = createContext<GridContextType>();

const Grid: ParentComponent<GridProps> = (props) => {
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
        <LayoutBase {...props} componentClasses={styles.Grid}>
            <GridContext.Provider value={{placeTile}}>
                {/* Neccessary to call props.children because gridTile won't mount */}
                {props.children}
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
            </GridContext.Provider>
        </LayoutBase>
    );
}

export default Grid;

