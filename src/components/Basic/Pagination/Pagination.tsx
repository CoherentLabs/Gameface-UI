import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createContext, createMemo, createSignal, createUniqueId, For, onMount, ParentComponent, Setter } from "solid-js";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { createTokenComponent, TokenBase, useTokens } from "@components/utils/tokenComponents";
import Arrow from './Arrow.svg?component-solid';
import styles from './Pagination.module.css';
import PaginationItem from "./PaginationItem";
import { Control, PaginationControl } from "./PaginationControl";
import { clamp } from "@components/utils/clamp";

export interface PaginationRef {
    element: HTMLDivElement,
}

interface PaginationProps extends ComponentProps {
    pageSize: number,
    pageIndex: number,
    loop?: boolean,
    hasNumbers?: boolean,
    disabled?: boolean;
    'class-disabled'?: string;
    onChange?: (index: number) => void;
}

interface PaginationContext {
    current: Accessor<number>,
    changePage: (index: number) => void,
    nextPage: () => void,
    previousPage: () => void,
}

export const PaginationContext = createContext<PaginationContext>();
export const Item = createTokenComponent<TokenBase>();

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
        const newIndex = current === length() ? 1 : current + 1;

        changeIndex(newIndex)
    }

    const previousPage = () => {
        const current = index();
        const newIndex = current === 1 ? length() : current - 1;

        changeIndex(newIndex)
    }

    const changeIndex = (newIndex: number) => {
        const clamped = props.loop ? newIndex : clamp(newIndex, 1, length());
        setIndex(clamped);
        props.onChange?.(clamped);
    }

    const showLeftArrow = createMemo(() => {
        if (props.loop) return true;

        return index() !== 1;
    })

    const showRightArrow = createMemo(() => {
        if (props.loop) return true;

        return index() !== length();
    })

    const paginationClasses = createMemo(() => {
        const classes = [styles.pagination];

        classes.push(props.class ?? '');

        if (props.disabled) {
            classes.push(styles.disabled);
            classes.push(props["class-disabled"] ?? '');
        }

        return classes.join(' ');
    });

    props.componentClasses = () => paginationClasses();
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