import { JSX } from "@solidjs/web";
import { createContext } from "solid-js";

export type GridContextType = {
    placeTile: (row: number, col: number, content: JSX.Element) => void;
};

export const GridContext = createContext<GridContextType>();