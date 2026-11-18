import { ParentComponent, For, createSignal, onSettled, createMemo, untrack } from "solid-js";
import { JSX } from "@solidjs/web";
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
    // The grid size is read once (as in 1.x). GridTile children register
    // themselves while they are created, so this signal accepts writes from
    // their setup (ownedWrite).
    const initialGrid = untrack(() => Array.from({ length: props.rows }, () => Array.from({ length: props.cols }, () => null)));
    const [gridTiles, setGridTiles] = createSignal<(JSX.Element | null)[][]>(initialGrid, { ownedWrite: true });

    const placeTile = (row: number, col: number, item: Element | JSX.Element) => {
        setGridTiles((prev) => {
            // Copy only the changed row: unchanged rows keep their identity, so
            // <For> keeps their DOM instead of rebuilding every row.
            const updatedGrid = prev.map((r, i) => (i === row ? [...r] : r));
            if (row < 0 || col < 0 || row >= props.rows || col >= props.cols) {
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
        get rows() { return props.rows; },
        get cols() { return props.cols; },
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

    onSettled(() => { warnIfUnsupported(props, "gap"); });

    return (
        <LayoutBase {...props} class={[styles.Grid, props.class]} componentStyles={gridStyles()} refObject={gridObjectRef}>
            <GridContext value={{ placeTile }}>
                {props.children}
                <For each={gridTiles()}>
                    {(row) => (
                        <div class={[styles['Grid-row'], props["row-class"]]} style={rowStyles()}>
                            <For each={row}>{(cell) =>
                                <div class={[styles['Grid-col'], props["column-class"]]} style={props["column-style"]}>
                                    {cell}
                                </div>
                            }</For>
                        </div>
                    )}
                </For>
            </GridContext>
        </LayoutBase>
    );
}

export default Object.assign(Grid, { Tile: GridTile });