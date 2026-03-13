import { ParentComponent, JSX, For, createContext, createSignal, onMount, createMemo } from "solid-js";
import styles from './Grid.module.scss';
import LayoutBase from "../LayoutBase";
import { BaseComponentRef, ComponentBaseProps } from "../../types/ComponentProps";
import { GAMEFACE_VERSION, verIsAtLeast } from "@components/utils/gamefaceVersion";

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

type GridContextType = {
    placeTile: (row: number, col: number, content: JSX.Element) => void;
};

export const GridContext = createContext<GridContextType>();

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
            'row-gap': props['row-gap'],
        }
    })

    const rowStyles = createMemo(() => {
        return {
            'column-gap': props['column-gap'] ? props['column-gap'] : props.gap,
            ...props["row-style"]
        }
    })

    let warningShown: boolean = false;
    onMount(() => {
        const hasGap = !!(props.gap || props["row-gap"] || props["column-gap"]);
        if (!warningShown && hasGap && !verIsAtLeast(2, 2)) {
            console.warn(
                `[Gameface UI] The "gap" property is unsupported in Gameface v${GAMEFACE_VERSION}. Upgrade to 2.2+`
            );
            warningShown = true;
        }
    })

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

export default Grid;

