import Column from "@components/Layout/Column/Column";
import Row from "@components/Layout/Row/Row";
import { createMemo, createSignal, For, onMount } from "solid-js";
import { player, POSITIONS, sortType } from "./types";
import styles from './FilterableDataTable.module.scss';
import { setPlayersState } from "./store/playersStore";
import { produce } from "solid-js/store";
import HeaderColumnButton from "./HeaderColumnButton";
import Relative from "@components/Layout/Relative/Relative";
import Absolute from "@components/Layout/Absolute/Absolute";
import { ROSTER_COLUMNS, ColumnDef } from "./columns";

const DEFAULT_SORT_KEY: sortType = "goals";

const TableHeader = () => {
    const [asc, setAsc] = createSignal(false);
    const [currentSort, setCurrentSort] = createSignal<sortType>(DEFAULT_SORT_KEY)

    const positions = [...POSITIONS];
    const [currPosition, setCurrentPosition] = createSignal<player['position'] | undefined>(undefined);

    const handleSort = (key: sortType) => {
        if (currentSort() === key) setAsc(prev => !prev);
        sortPlayers(key);
        setCurrentSort(key);
        setCurrentPosition(undefined);
    }
    
    const sortPlayers = (key: sortType) => {
        setPlayersState(produce((players) => {
            players.sort((a, b) => {
                const aValue = a[key] ?? 0;
                const bValue = b[key] ?? 0;
    
                if (key !== 'name' && key !== 'nationality') {
                    return asc() ? 
                        (aValue as number) - (bValue as number) :
                        (bValue as number) - (aValue as number);
                } else {
                    return asc() ?
                        String(aValue).localeCompare(String(bValue)) :
                        String(bValue).localeCompare(String(aValue))
                }
            });
        }))
    }

    const cyclePosition = () => {
        if (currPosition()) {
            const lastLeadPosition = positions.shift();
            positions.push(lastLeadPosition!);
        }

        setCurrentPosition(positions[0]);
        setPlayersState(produce((players) => {
            players.sort((a, b) => positions.indexOf(a.position) - positions.indexOf(b.position));
        }))
        setCurrentSort('position')
    }

    const posMark = createMemo(() => {
        const p = currPosition();
        return p ? `(${p.charAt(0)})` : null;
    })

    const renderHeaderCell = (col: ColumnDef) => {
        switch (col.header) {
            case 'sort':
                return (
                    <HeaderColumnButton
                        asc={asc}
                        category={col.id as sortType}
                        currentSort={currentSort}
                        clickHandler={handleSort}>{col.label}</HeaderColumnButton>
                );
            case 'cycle':
                return (
                    <Relative
                        click={cyclePosition}
                        style={{ cursor: "pointer", "font-weight": currentSort() === "position" ? 'bold' : 'normal' }}>
                        <div>{col.label}</div>
                        <Absolute class={styles['column-pos-mark']}>{posMark()}</Absolute>
                    </Relative>
                );
            case 'static':
                return <div>{col.label}</div>;
            default:
                return null;
        }
    }

    onMount(() => sortPlayers(DEFAULT_SORT_KEY))

    return (
        <Row class={styles.header}>
            <For each={ROSTER_COLUMNS}>{(col) => {
                const Col = col.span === 2 ? Column.Two : Column.One;

                return (
                    <Col class={`${styles.column} ${col.columnClass ?? ''}`.trim()}>
                        {renderHeaderCell(col)}
                    </Col>
                );
            }}</For>
        </Row>
    )
}

export default TableHeader