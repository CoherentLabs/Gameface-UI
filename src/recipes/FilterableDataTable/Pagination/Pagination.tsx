import PaginationBase, { PaginationRef } from "@components/Basic/Pagination/Pagination"
import { Component } from "solid-js"
import styles from './Pagination.module.scss';

interface PaginationProps {
    size: number,
    currentPage: number,
    onChange: (page: number) => void,
    ref?: (ref: PaginationRef) => void
}

const Pagination: Component<PaginationProps> = (props) => {
    return (
        <PaginationBase
            ref={props.ref}
            class={styles.pagination}
            onChange={props.onChange}
            pageSize={props.size}
            pageIndex={props.currentPage}
            hasNumbers>
            <PaginationBase.Control
                class={styles['pagination-control']}
                hidden-class={styles['pagination-control-disabled']}  />
            <PaginationBase.Item
                class={styles['page-item']}
                selected-class={styles['page-item-selected']} />
        </PaginationBase>
    )
}

export default Pagination;