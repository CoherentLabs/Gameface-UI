export const POSITIONS = ['fwd', 'mid', 'def', 'gk'] as const;
export type PlayerPosition = typeof POSITIONS[number];

export interface player {
    name: string;
    nationality: string; // country code (e.g. 'ar', 'br') — used as the flag lookup key
    country: string;
    position: PlayerPosition;
    age: number;
    appearances: number;
    is_injured: boolean;
    goals: number;
    assists: number;
    condition: number;
    value: number;
    image: string;
}

export type sortType = Exclude<keyof player, 'image' | 'is_injured'>;
