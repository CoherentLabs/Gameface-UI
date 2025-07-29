import { Component, createMemo, ParentComponent, Show, useContext } from "solid-js"
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import { TokenComponentProps } from "@components/types/ComponentProps";
import { Item, PaginationContext } from "./Pagination";
import styles from './Pagination.module.css';

interface PaginationItemComponentProps extends TokenComponentProps {
    index: number,
    max: number
    hasNumbers: boolean,
}

const PaginationItem: Component<PaginationItemComponentProps> = (props) => {
    const pagination = useContext(PaginationContext);
    const itemToken = useToken(Item, props.parentChildren);

    const isSelected = createMemo(() => pagination?.current() === props.index);

    const paginationItemClasses = createMemo(() => {
        const classes = [styles['dot-item']]

        if (props.hasNumbers) classes.push(styles['has-numbers'])
        if (props.index === props.max) classes.push(styles.last);
        if (isSelected()) classes.push(styles.selected);
        if (itemToken()?.class) classes.push(itemToken()?.class ?? '');

        return classes.join(' ');
    })

    return (
        <div
            onclick={() => pagination!.changePage(props.index)}
            style={itemToken()?.style}
            class={paginationItemClasses()}>
                <Show when={props.hasNumbers}>{props.index}</Show>
        </div>
    )
}

export default PaginationItem;