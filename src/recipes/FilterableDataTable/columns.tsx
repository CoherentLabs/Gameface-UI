import { Accessor, JSX } from "solid-js";
import { player, sortType } from "./types";
import styles from './FilterableDataTable.module.scss';
import BackgroundImage from "@components/Media/BackgroundImage/BackgroundImage";
import Flex from "@components/Layout/Flex/Flex";
import ConditionBar from "./ConditionBar/ConditionBar";
import FLAG_SRC from "./utils/flagImages";

// How the header cell for a column behaves:
//  - 'sort'   → clickable HeaderColumnButton (asc/desc on the field)
//  - 'cycle'  → the custom rotating position control (rendered by TableHeader)
//  - 'static' → plain label, no interaction (e.g. NAT.)
//  - 'none'   → empty header cell (e.g. the player image column)
export type HeaderKind = 'sort' | 'cycle' | 'static' | 'none';

const getInitials = (name: string) => {
    const letters = name.match(/[A-Za-z]+/g) ?? [];
    return ((letters[0]?.[0] ?? '') + (letters[letters.length - 1]?.[0] ?? '')).toUpperCase();
};

export interface ColumnDef {
    id: string;                            // stable key for the <For>
    span: 1 | 2;                           // Column.One / Column.Two
    label?: string;                        // header text
    header: HeaderKind;
    columnClass?: string;
    cell: (player: Accessor<player>) => JSX.Element; // how the row cell renders (accessor so paging updates in place)
}

// Single source of truth for the roster table's column layout.
// Both TableHeader and TableRow iterate this, so their structure stays in lockstep.
export const ROSTER_COLUMNS: ColumnDef[] = [
    {
        id: 'image',
        span: 1,
        header: 'none',
        cell: (p) => (
            <>
                {/* PLACEHOLDER */}
                <Flex
                    justify-content="center"
                    align-items="center"
                    style={{ width: '100%', height: '100%', 'background-color': 'gray', color: 'white' }}
                >{getInitials(p().name)}</Flex>

                {/* ORIGINAL */}
                {/* <BackgroundImage fill options={{ position: "center", size: 'cover' }} src={p().image} /> */}
            </>
        ),
    },
    {
        id: 'name',
        span: 2,
        label: 'NAME',
        header: 'sort',
        columnClass: styles['column-name'],
        cell: (p) => <div class={styles['column-name-value']}>{p().name}</div>,
    },
    {
        id: 'nationality',
        span: 1,
        label: 'NAT.',
        header: 'static',
        cell: (p) => (
            <>
                {/* PLACEHOLDER */}
                <Flex
                    justify-content="center"
                    align-items="center"
                    class={styles['column-image']}
                    style={{ 'background-color': 'gray', color: 'white' }}
                >{p().nationality}</Flex>

                {/* ORIGINAL */}
                {/* <BackgroundImage class={styles['column-image']} src={FLAG_SRC[p().nationality]} /> */}
            </>
        ),
    },
    {
        id: 'position',
        span: 1,
        label: 'POS.',
        header: 'cycle',
        cell: (p) => <div class={styles['column-position']}>{p().position}</div>,
    },
    {
        id: 'age',
        span: 1,
        label: 'AGE',
        header: 'sort',
        cell: (p) => <div>{p().age}</div>,
    },
    {
        id: 'appearances',
        span: 1,
        label: 'APPS.',
        header: 'sort',
        cell: (p) => <div>{p().appearances}</div>,
    },
    {
        id: 'goals',
        span: 1,
        label: 'GOALS',
        header: 'sort',
        cell: (p) => <div>{p().goals}</div>,
    },
    {
        id: 'assists',
        span: 1,
        label: 'ASSISTS',
        header: 'sort',
        cell: (p) => <div>{p().assists}</div>,
    },
    {
        id: 'condition',
        span: 2,
        label: 'COND.',
        header: 'sort',
        cell: (p) => (
            <Flex class={styles['column-condition']}>
                <ConditionBar value={p().condition}  />
                <div>{`${p().condition}%`}</div>
            </Flex>
        ),
    },
    {
        id: 'value',
        span: 1,
        label: 'VALUE',
        header: 'sort',
        cell: (p) => <div>{`€${p().value}M`}</div>,
    },
];
