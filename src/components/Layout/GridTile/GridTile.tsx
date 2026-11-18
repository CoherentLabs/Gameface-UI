import { ParentComponent, useContext, untrack } from "solid-js";
import { JSX } from "@solidjs/web";
import { ComponentBaseProps } from "../../types/ComponentProps";
import LayoutBase from "../LayoutBase";
import { BaseComponentRef } from "../../types/ComponentProps";
import style from './GridTile.module.scss';
import { GridContext } from "../Grid/GridContext";

export interface GridTileRef extends BaseComponentRef {
    row: number,
    col: number,
    tile: JSX.Element,
    moveTile: (newRow: number, newCol: number) => void,
    removeTile: () => void,
    replaceTile: (newTile: Element | JSX.Element) => void
}

export interface GridTileProps extends ComponentBaseProps {
    row: number
    col: number
}

const GridTile: ParentComponent<GridTileProps> = (props) => {
    const gridContext = useContext(GridContext)

    if (!gridContext) throw new Error("GridTile component must be used within a Grid component");

    const { placeTile } = gridContext;
    // The current tile content. Not reactive state (nothing renders from it),
    // so a plain variable: no signal write during setup.
    let tile: JSX.Element | null = null;

    const moveTile = (newRow: number, newCol: number) => {
        placeTile(newRow - 1, newCol - 1, tile);
    }

    const removeTile = () => {
        placeTile(props.row - 1, props.col - 1, null);
    }

    const replaceTile = (newTile: Element | JSX.Element) => {
        tile = newTile as JSX.Element;
        placeTile(props.row - 1, props.col - 1, tile);
    }

    const gridTileRef = {
        get row() { return props.row; },
        get col() { return props.col; },
        get tile() { return tile; },
        moveTile,
        removeTile,
        replaceTile,
    }

    tile = <LayoutBase {...props} refObject={gridTileRef} />;
    // Register with the parent Grid while being created (its signal allows
    // owned writes). Position is read once, as in 1.x.
    untrack(() => placeTile(props.row - 1, props.col - 1, tile));

    return null
}

export default GridTile;

