import { createContext } from "solid-js";
import { JSX } from "@solidjs/web";

export type GridContextType = {
    placeTile: (row: number, col: number, content: JSX.Element) => void;
};

// `null` default: GridTile reports its own error outside a Grid (pattern 1.3.o).
export const GridContext = createContext<GridContextType | null>(null);
