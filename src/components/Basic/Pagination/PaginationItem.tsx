import { Component, createMemo, Show, useContext } from "solid-js"
import { useToken } from "@components/utils/tokenComponents";
import { TokenComponentProps } from "@components/types/ComponentProps";
import { Item, PaginationContext } from "./Pagination";
import styles from './Pagination.module.scss';

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
        if (isSelected()) {
            if (itemToken()?.["selected-class"]) {
                classes.push(itemToken()?.["selected-class"] ?? '');
            } else {
                classes.push(styles.selected);
            }
        }
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