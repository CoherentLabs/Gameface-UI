import { ParentProps, Component, ParentComponent, JSX, For, children, createContext, useContext, onMount  } from "solid-js";
import styles from './GridTile.module.css'
import { GridContext } from "../Grid/Grid";
import LayoutBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";

interface GridTileProps extends LayoutBaseProps {
    row: number
    col: number
}

const GridTile: ParentComponent<GridTileProps> = (props) => {
    const gridContext = useContext(GridContext)

    if (!gridContext) {
        throw new Error("GridTile component must be used within a Grid component");
    }

    const { placeTile } = gridContext;

    const tileContent = (
        <LayoutBase {...props} componentClasses={styles.gridTile} />
    )
    
    placeTile(props.row - 1, props.col - 1, tileContent);

    // Add methods to add tiles to add, remove, replace tiles in the grid
    const moveTile = (newRow: number, newCol: number, tileElement: JSX.Element) => {
        placeTile(newRow - 1, newCol - 1, tileElement);
    }

    const removeTile = () => {
        
    }

    return null
}

export default GridTile;

