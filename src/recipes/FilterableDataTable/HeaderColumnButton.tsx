import { Accessor, createMemo, ParentComponent } from "solid-js";
import styles from './FilterableDataTable.module.scss';
import { sortType } from "./types";

interface Props {
    category: sortType;
    currentSort: Accessor<sortType>;
    asc: Accessor<boolean>;
    clickHandler: (key: sortType) => void
}

const HeaderColumnButton: ParentComponent<Props> = (props) => {
    const classes = createMemo(() => {
        const base = [styles['column-btn']];

        if (props.category === props.currentSort()) {
            base.push(styles['column-btn-active'])
            if (props.asc()) base.push(styles['column-btn-asc'])
        }
        
        return base.join(' ');
    })

    return (
        <div class={classes()} onClick={() => props.clickHandler(props.category)}>{props.children}</div>
    )
}

export default HeaderColumnButton;