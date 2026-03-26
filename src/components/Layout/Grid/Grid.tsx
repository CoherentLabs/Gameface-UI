import { ParentComponent, JSX, For, createSignal, onMount, createMemo } from "solid-js";
import styles from './Grid.module.scss';
import LayoutBase from "../LayoutBase";
import { BaseComponentRef, ComponentBaseProps } from "../../types/ComponentProps";
import { warnIfUnsupported } from "@components/utils/supportsGamefaceFeature";
import GridTile from "@components/Layout/GridTile/GridTile";
import { GridContext } from "./GridContext";

export interface GridRef extends BaseComponentRef {
    rows: number,
    cols: number,
    addItem: (row: number, col: number, item: Element | JSX.Element) => void,
    removeItem: (row: number, col: number) => void,
}

interface GridProps extends ComponentBaseProps {
    rows: number;
    cols: number;
    'row-style'?: JSX.CSSProperties; 
    'column-style'?: JSX.CSSProperties; 
    'row-class'?: string,
    'column-class'?: string,
    gap?: string;
    'row-gap'?: string;
    'column-gap'?: string;
}

const Grid: ParentComponent<GridProps> = (props) => {
    const initialGrid = Array.from({ length: props.rows }, () => Array.from({ length: props.cols }, () => null));
    const [gridTiles, setGridTiles] = createSignal<(JSX.Element | null)[][]>(initialGrid);

    const placeTile = (row: number, col: number, item: Element | JSX.Element) => {
        setGridTiles((prev) => {
            const updatedGrid = prev.map((r) => [...r]);
            if (row >= props.rows && col >= props.cols) {
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

    const gridObjectRef = {
        rows: props.rows,
        cols: props.cols,
        addItem,
        removeItem,
    }

    const gridStyles = createMemo(() => {
        return {
            gap: props.gap,
            'row-gap': props['row-gap'] ?? props.gap,
        }
    })

    const rowStyles = createMemo(() => {
        return {
            'column-gap': props['column-gap'] ?? props.gap,
            ...props["row-style"]
        }
    })

    onMount(() => warnIfUnsupported(props, "gap"))

    return (
        <LayoutBase {...props} componentClasses={styles.Grid} componentStyles={gridStyles()} refObject={gridObjectRef}>
            <GridContext.Provider value={{ placeTile }}>
                {props.children}
                <For each={gridTiles()}>
                    {(row) => (
                        <div class={`${styles['Grid-row']} ${props["row-class"] ?? ''}`} style={rowStyles()}>
                            <For each={row}>{(cell) =>
                                <div class={`${styles['Grid-col']} ${props["column-class"] ?? ''}`} style={props["column-style"]}>
                                    {cell}
                                </div>
                            }</For>
                        </div>
                    )}
                </For>
            </GridContext.Provider>
        </LayoutBase>
    );
}

export default Object.assign(Grid, { Tile: GridTile });