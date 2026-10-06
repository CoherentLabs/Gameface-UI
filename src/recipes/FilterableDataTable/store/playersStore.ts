import { createStore } from "solid-js/store";
import { createMemo, createRoot } from "solid-js";
import { player } from "../types";
import players from "../utils/mockPlayers";

const [playersState, setPlayersState] = createStore<player[]>(players);

const { countries, numericStats } = createRoot(() => {
    const countries = createMemo(() => playersState.reduce<{ name: string, code: string }[]>((acc, player) => {
        if (!acc.some(c => c.name === player.country)) {
            acc.push({ name: player.country, code: player.nationality });
        }
        return acc;
    }, []));

    const numericStats = createMemo(() =>
        playersState.reduce(
        (acc, p) => ({
            age:         { min: Math.min(acc.age.min, p.age),                 max: Math.max(acc.age.max, p.age) },
            appearances: { min: Math.min(acc.appearances.min, p.appearances), max: Math.max(acc.appearances.max, p.appearances) },
            goals:       { min: Math.min(acc.goals.min, p.goals),             max: Math.max(acc.goals.max, p.goals) },
            assists:     { min: Math.min(acc.assists.min, p.assists),         max: Math.max(acc.assists.max, p.assists) },
            condition:   { min: Math.min(acc.condition.min, p.condition),     max: Math.max(acc.condition.max, p.condition) },
            value:       { min: Math.min(acc.value.min, p.value),             max: Math.max(acc.value.max, p.value) },
        }),
        {
            age:         { min: Infinity, max: -Infinity },
            appearances: { min: Infinity, max: -Infinity },
            goals:       { min: Infinity, max: -Infinity },
            assists:     { min: Infinity, max: -Infinity },
            condition:   { min: Infinity, max: -Infinity },
            value:       { min: Infinity, max: -Infinity },
        }
        )
    );

    return { countries, numericStats };
});

export {
    playersState,
    setPlayersState,
    countries,
    numericStats
}
