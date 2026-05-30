import { ParentComponent, useContext, onSettled } from "solid-js";
import { LayoutComponentProps } from "../../types/ComponentProps";
import LayoutBase from "../LayoutBase";
import { BaseComponentRef } from "../../types/ComponentProps";
import { GridContext, GridContextType } from "../Grid/GridContext";
import { JSX } from "@solidjs/web";

export interface GridTileRef extends BaseComponentRef {
    row: number,
    col: number,
    tile: JSX.Element,
    moveTile: (newRow: number, newCol: number) => void,
    removeTile: () => void,
    replaceTile: (newTile: Element | JSX.Element) => void
}

export interface GridTileProps extends LayoutComponentProps<GridTileRef> {
    row: number
    col: number
}

const GridTile: ParentComponent<GridTileProps> = (props) => {
    let gridContext: GridContextType;

    try { gridContext = useContext(GridContext) }
    catch (error) {
        throw new Error("GridTile component must be used within a Grid component");
    }

    const { placeTile } = gridContext;
    let tile: JSX.Element | null = null;

    const moveTile = (newRow: number, newCol: number) => {
        placeTile(newRow - 1, newCol - 1, tile);
    }

    const removeTile = () => {
        placeTile(props.row - 1, props.col - 1, null);
    }

    const replaceTile = (newTile: Element | JSX.Element) => {
        tile = newTile;
        placeTile(props.row - 1, props.col - 1, tile);
    }

    const gridTileRef = {
        row: props.row,
        col: props.col,
        moveTile,
        removeTile,
        replaceTile,
    }

    const initialTile = (
        <LayoutBase {...props} refObject={gridTileRef} />
    )

    tile = initialTile;

    onSettled(() => {
        placeTile(props.row - 1, props.col - 1, tile);
    });

    return null
}

export default GridTile;
