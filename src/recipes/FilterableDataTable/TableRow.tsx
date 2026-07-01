import Column from "@components/Layout/Column/Column";
import Row from "@components/Layout/Row/Row";
import { Accessor, For } from "solid-js";
import { player } from "./types";
import styles from './FilterableDataTable.module.scss';
import { ROSTER_COLUMNS } from "./columns";

const TableRow = (props: { data: Accessor<player>, index: number }) => {
    return (
        <Row class={`${styles.row} ${props.index === 0 ? styles['row-active'] : ''}`}>
            <For each={ROSTER_COLUMNS}>{(col) => {
                const Col = col.span === 2 ? Column.Two : Column.One;
                return (
                    <Col class={`${styles.column} ${col.columnClass ?? ''}`.trim()}>
                        {col.cell(props.data)}
                    </Col>
                );
            }}</For>
        </Row>
    )
}

export default TableRow