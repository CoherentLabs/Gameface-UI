import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createContext, createMemo, createSignal, For, onMount, ParentComponent } from "solid-js";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { createTokenComponent, TokenBase } from "@components/utils/tokenComponents";
import PaginationItem from "./PaginationItem";
import { Control, PaginationControl } from "./PaginationControl";
import styles from './Pagination.module.css';

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

export const PaginationContext = createContext<PaginationContext>();
export const Item = createTokenComponent<PaginationItemToken>();

const Pagination: ParentComponent<PaginationProps> = (props) => {
    const items = createMemo(() => Array.from({ length: props.pageSize }, (_, i) => i + 1));
    const [index, setIndex] = createSignal(props.pageIndex);
    const length = createMemo(() => items().length); 
    let element!: HTMLDivElement;

    const changePage = (index: number) => {
        if (index <= 0 || index > length()) {
            return console.error('Invalid index');
        }

        changeIndex(index);
    }

    const nextPage = () => {
        const current = index();
        const isLastIndex = current === length();
        
        if (isLastIndex && !props.loop) return;
        
        changeIndex(isLastIndex ? 1 : current + 1)
    }

    const previousPage = () => {
        const current = index();
        const isFirstIndex = current === 1;

        if (isFirstIndex && !props.loop) return;
        
        changeIndex(isFirstIndex ? length() : current - 1)
    }

    const changeIndex = (newIndex: number) => {
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

    props.componentClasses = styles.pagination;
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            element,
            pageIndex: index(),
            pageSize: length(),
            changeIndex,
            nextPage,
            previousPage
        });
    });

    return (
        <PaginationContext.Provider value={{ current: index, changePage, nextPage, previousPage }}>
            <div
                ref={element!}
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props}
                use:forwardAttrs={props} >
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
        </PaginationContext.Provider>
    )
}

export default Object.assign(Pagination, {Item, Control});