import { PlayerPosition } from "../types";

export interface PlayerFilters {
    position: PlayerPosition[];
    nationality: string[];
    age:         { min: number, max: number } | undefined;
    condition:   number | undefined;
    appearances: number | undefined;
    goals:       number | undefined;
    assists:     number | undefined,
}

export const DEFAULT_FILTERS: PlayerFilters = {
    position: [],
    nationality: [],
    age: undefined,
    condition: undefined,
    appearances: undefined,
    goals: undefined,
    assists: undefined,
};

export const isDefaultFilters = (f: PlayerFilters): boolean =>
    f.position.length === DEFAULT_FILTERS.position.length &&
    f.nationality.length === DEFAULT_FILTERS.nationality.length &&
    f.age === DEFAULT_FILTERS.age &&
    f.condition === DEFAULT_FILTERS.condition &&
    f.appearances === DEFAULT_FILTERS.appearances &&
    f.goals === DEFAULT_FILTERS.goals &&
    f.assists === DEFAULT_FILTERS.assists;