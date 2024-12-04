import { ParentComponent, JSX, For, createContext, createSignal  } from "solid-js";
import styles from './Grid.module.css';
import LayoutBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";

export interface GridRef {
    rows: number,
    cols: number,
    addItem: (row: number, col: number, item: Element | JSX.Element) => void,
    removeItem: (row: number, col: number) => void,
}

interface GridProps extends LayoutBaseProps {
    rows: Required<number>
    cols: Required<number>
}

type GridContextType = {
    placeTile: (row: number, col: number, content: JSX.Element) => void;
};

export const GridContext = createContext<GridContextType>();

const Grid: ParentComponent<GridProps> = (props) => {
    const initialGrid = Array.from({ length: props.rows }, () => Array.from({length: props.cols}, () => null));
    const [gridTiles, setGridTiles] = createSignal<(JSX.Element | null)[][]>(initialGrid);

    const placeTile = (row: number, col: number, item: Element | JSX.Element) => {
        setGridTiles((prev) => {
            const updatedGrid = prev.map((r) => [...r]);
            if (row >= props.rows && col >= props.cols){
                throw new Error('You are trying to manipulate a non existing grid cell!')
            }
            updatedGrid[row][col] = item
            return updatedGrid;
        })
    }

    const addItem = (row: number, col: number, item: Element | JSX.Element) => {
        placeTile(row - 1, col - 1, item);
    }

    const removeItem = (row: number, col: number) => {
        placeTile(row - 1, col - 1, null);
    }

    const gridObjectRef: GridRef = {
        rows: props.rows,
        cols: props.cols,
        addItem,
        removeItem,
    }

    return (
        <LayoutBase {...props} componentClasses={styles.Grid} refObject={gridObjectRef}>
            <GridContext.Provider value={{placeTile}}>
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

