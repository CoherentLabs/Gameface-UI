import { ParentComponent, JSX, useContext, createSignal } from "solid-js";
import { GridContext } from "../Grid/Grid";
import { ComponentBaseProps } from "../../types/ComponentProps";
import LayoutBase from "../LayoutBase";
import { BaseComponentRef } from "../../types/ComponentProps";

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
    const [tile, setTile] = createSignal<JSX.Element | null>(null);

    const moveTile = (newRow: number, newCol: number) => {
        placeTile(newRow - 1, newCol - 1, tile());
    }

    const removeTile = () => {
        placeTile(props.row - 1, props.col - 1, null);
    }

    const replaceTile = (newTile: Element | JSX.Element) => {
        setTile(newTile)
        placeTile(props.row - 1, props.col - 1, tile());
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

    setTile(initialTile)
    placeTile(props.row - 1, props.col - 1, tile());

    return null
}

export default GridTile;

