import { createContext, JSX } from "solid-js";

export type GridContextType = {
    placeTile: (row: number, col: number, content: JSX.Element) => void;
};

export const GridContext = createContext<GridContextType>();