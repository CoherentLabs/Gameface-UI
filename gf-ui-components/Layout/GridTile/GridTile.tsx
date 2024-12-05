import { ParentComponent, JSX, useContext, createSignal } from "solid-js";
import styles from './GridTile.module.css'
import { GridContext } from "../Grid/Grid";
import LayoutBaseProps from "../../types/LayoutBase";
import LayoutBase, { LayoutBaseRef } from "../LayoutBase";

export interface GridTileRef extends LayoutBaseRef {
    row: number,
    col: number,
    tile: JSX.Element,
    moveTile: (newRow: number, newCol: number) => void,
    removeTile: () => void,
    replaceTile: (newTile: Element | JSX.Element) => void
}

export interface GridTileProps extends LayoutBaseProps {
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
        <LayoutBase {...props} componentClasses={styles.GridTile} refObject={gridTileRef}/>
    )

    setTile(initialTile)
    placeTile(props.row - 1, props.col - 1, tile());

    return null
}

export default GridTile;

