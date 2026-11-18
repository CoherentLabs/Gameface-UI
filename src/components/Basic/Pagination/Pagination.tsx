import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createContext, createMemo, createSignal, For, ParentComponent, untrack } from "solid-js";
import { createTokenComponent, TokenBase } from "@components/utils/tokenComponents";
import PaginationItem from "./PaginationItem";
import { Control, PaginationControl } from "./PaginationControl";
import styles from './Pagination.module.scss';
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";

export interface PaginationRef {
    element: HTMLDivElement,
    pageIndex: Accessor<number>,
    pageSize: Accessor<number>,
    changeIndex: (index: number) => void,
    nextPage: () => void,
    previousPage: () => void
}

interface PaginationProps extends ComponentProps {
    pageSize: number,
    pageIndex: number,
    loop?: boolean,
    hasNumbers?: boolean,
    onChange?: (index: number) => void;
}

interface PaginationContext {
    current: Accessor<number>,
    changePage: (index: number) => void,
    nextPage: () => void,
    previousPage: () => void,
}

interface PaginationItemToken extends Omit<TokenBase, "children"> {
    "selected-class"?: string
}

// `null` default: the parts read it optionally (pattern 1.3.o).
export const PaginationContext = createContext<PaginationContext | null>(null);
export const Item = createTokenComponent<PaginationItemToken>();

const Pagination: ParentComponent<PaginationProps> = (props) => {
    const items = createMemo(() => Array.from({ length: props.pageSize }, (_, i) => i + 1));
    // Initial page only, as in 1.x.
    const initialIndex = untrack(() => props.pageIndex);
    const [index, setIndex] = createSignal(initialIndex);
    // Always-current plain copy for next/previous (Solid 2 stages signal writes).
    let current = initialIndex;
    const length = createMemo(() => items().length);

    const changePage = (index: number) => {
        if (index <= 0 || index > length()) {
            return console.error('Invalid index');
        }

        changeIndex(index);
    }

    const nextPage = () => {
        const isLastIndex = current === length();

        if (isLastIndex && !props.loop) return;

        changeIndex(isLastIndex ? 1 : current + 1)
    }

    const previousPage = () => {
        const isFirstIndex = current === 1;

        if (isFirstIndex && !props.loop) return;

        changeIndex(isFirstIndex ? length() : current - 1)
    }

    const changeIndex = (newIndex: number) => {
        current = newIndex;
        setIndex(newIndex);
        props.onChange?.(newIndex);
    }

    const showLeftArrow = createMemo(() => {
        if (props.loop) return true;

        return index() !== 1;
    })

    const showRightArrow = createMemo(() => {
        if (props.loop) return true;

        return index() !== length();
    })

    return (
        <PaginationContext value={{ current: index, changePage, nextPage, previousPage }}>
            <div
                class={[styles.pagination, props.class]}
                style={props.style}
                ref={[
                    exposeRef<Omit<PaginationRef, 'element'>>(props, { pageIndex: index, pageSize: length, changeIndex, nextPage, previousPage }),
                    baseComponent(props),
                    navigationActions({
                        anchor: props.anchor,
                        ...props.onAction,
                    }),
                ]}>
                <PaginationControl direction="prev" parentChildren={props.children} visible={showLeftArrow()} />
                <For each={items()}>
                    {(i) =>
                        <PaginationItem
                            hasNumbers={props.hasNumbers || false}
                            index={i}
                            max={length()}
                            parentChildren={props.children} />
                    }
                </For>
                <PaginationControl direction="next" parentChildren={props.children} visible={showRightArrow()} />
            </div>
        </PaginationContext>
    )
}

export default Object.assign(Pagination, { Item, Control });
