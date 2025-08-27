import { PaginationRef } from "@components/Basic/Pagination/Pagination";
import { createContext, createEffect, createMemo, createSignal, on, onCleanup, onMount, ParentComponent, ParentProps, Setter } from "solid-js";
import CarouselItems, { CarouselItemTokenProps, Item } from "./CarouselItems";
import CarouselPagination from "./CarouselPagination";
import { CarouselNext } from "./CarouselNext";
import { CarouselPrev } from "./CarouselPrev";
import { waitForFrames } from "@components/utils/waitForFrames";
import { ComponentProps } from "@components/types/ComponentProps";
import styles from './Carousel.module.scss';
import useBaseComponent from "@components/BaseComponent/BaseComponent";


export interface CarouselRef {
    element: HTMLDivElement;
    itemsContainer: HTMLDivElement;
    next: () => void;
    prev: () => void;
    scrollTo: (page: number) => void;
    activePage: () => number;
    pagesCount: () => number;
    translateItemsContainer: () => void;
}

interface CarouselProps extends ComponentProps {
    itemWidth?: number
    itemGap?: number
    itemsAlignment?: 'start' | 'center' | 'end';
    groupItems?: boolean;
    leadingAndTrailingSpaces?: boolean;
    onActivePageChange?: (page: number) => void;
}

interface CarouselContextType {
    itemWidth: () => number;
    itemGap: () => number;
    setActivePage: Setter<number>;
    setItemsWrapper: (el: HTMLDivElement) => void
    setItemsContainer: (el: HTMLDivElement) => void
    setPaginationRef: (el: PaginationRef) => void
    activePage: () => number;
    pagesCount: () => number;
    scrollTo: (page: number) => void;
    next: () => void;
    prev: () => void;
    groupItems: () => boolean;
    setItems: Setter<any[]>;
}

export const CarouselContext = createContext<CarouselContextType>();

const Carousel: ParentComponent<CarouselProps> = (props) => {
    let resizeObserver!: ResizeObserver;
    let itemsWrapper!: HTMLDivElement;
    let itemsContainer!: HTMLDivElement;
    let paginationRef!: PaginationRef;
    let carouselRef!: HTMLDivElement;

    const [items, setItems] = createSignal<ParentProps<CarouselItemTokenProps>[]>([]);
    const [pagesCount, setPagesCount] = createSignal(0);
    const [activePage, setActivePage] = createSignal(props.groupItems ? 0 : 0);
    const itemWidth = createMemo(() => props.itemWidth || 100);
    const itemGap = createMemo(() => props.itemGap || 0);
    const itemsAlignment = createMemo(() => props.itemsAlignment || 'start');
    const groupItems = createMemo(() => !!props.groupItems);
    const leadingAndTrailingSpaces = createMemo(() => props.leadingAndTrailingSpaces === false ? false : true);

    createEffect(
        on([itemWidth, itemGap, groupItems], () => {
            updatePagesCount();
        }, { defer: true })
    );

    createEffect(
        on(items, () => {
            updatePagesCount();
            scrollTo(activePage(), true);
        }, { defer: true })
    );

    createEffect(
        on([itemsAlignment, leadingAndTrailingSpaces], () => waitForFrames(translateItemsContainer), { defer: true })
    );

    onMount(() => {
        waitForFrames(translateItemsContainer);

        resizeObserver = new ResizeObserver(translateItemsContainer);

        if (carouselRef!) resizeObserver.observe(carouselRef);

        if (!props.ref || !carouselRef) return;

        (props.ref as unknown as (ref: any) => void)({
            element: carouselRef,
            itemsContainer: itemsContainer,
            next,
            prev,
            scrollTo,
            activePage,
            pagesCount,
            translateItemsContainer
        });
    });

    onCleanup(() => {
        if (resizeObserver) resizeObserver.disconnect();
    });

    const fixLastItemSelection = () => {
        if (activePage() > pagesCount() - 1) {
            scrollTo(pagesCount() - 1);
        } else {
            translateItemsContainer();
        }
    }

    const updatePagesCount = () => {
        if (!groupItems()) {
            setPagesCount(items().length);
            fixLastItemSelection();
            return;
        }

        waitForFrames(() => {
            const { width } = itemsWrapper.getBoundingClientRect();
            const itemWidthPx = width * itemWidth() / 100;
            const totalItems = itemsContainer.children.length;
            const itemGapPx = (itemGap() / 100) * width;
            const itemsPerPage = Math.floor(width / (itemWidthPx + itemGapPx));
            const pages = Math.ceil(totalItems / itemsPerPage);

            setPagesCount(pages);
            fixLastItemSelection();
        });
    }

    const calculateOffset = (maxScrollOffset: number, baseOffset: number, adjustment: number = 0) => {
        const offset = baseOffset + adjustment;
        return leadingAndTrailingSpaces() && !groupItems() ? offset : Math.max(Math.min(offset, 0), -maxScrollOffset);
    };

    const getScrollOffset = (page: number, itemWidth: number, containerWidth: number) => {
        const totalItemsWidth = itemWidth * items().length;
        const maxScrollOffset = totalItemsWidth - containerWidth;

        if (groupItems()) {
            const itemsPerPage = Math.floor(containerWidth / itemWidth);
            const groupOffset = -(page * itemsPerPage * itemWidth);

            switch (itemsAlignment()) {
                case 'center': {
                    const adjustment = (containerWidth - (itemsPerPage * itemWidth)) / 2;
                    return calculateOffset(maxScrollOffset, groupOffset, adjustment);
                }
                case 'end': {
                    const adjustment = containerWidth - (itemsPerPage * itemWidth);
                    return calculateOffset(maxScrollOffset, groupOffset, adjustment);
                }
                case 'start':
                default: {
                    return calculateOffset(maxScrollOffset, groupOffset);
                }
            }
        } else {
            const pageItemOffset = -(itemWidth * page);

            switch (itemsAlignment()) {
                case 'center': {
                    const adjustment = (containerWidth / 2) - (itemWidth / 2);
                    return calculateOffset(maxScrollOffset, pageItemOffset, adjustment);
                }
                case 'end': {
                    const adjustment = containerWidth - itemWidth;
                    return calculateOffset(maxScrollOffset, pageItemOffset, adjustment);
                }
                case 'start':
                default: {
                    return calculateOffset(maxScrollOffset, pageItemOffset);
                }
            }
        }
    }

    const translateItemsContainer = () => {
        const { width } = itemsWrapper.getBoundingClientRect();
        const { width: containerWidth } = itemsContainer.getBoundingClientRect();
        const itemWidthPx = (itemWidth() / 100) * containerWidth;
        const itemGapPx = (itemGap() / 100) * width;
        const scrollOffset = getScrollOffset(activePage(), itemWidthPx + itemGapPx, width);
        itemsContainer.style.transform = `translateX(${scrollOffset}px)`;
    }

    const scrollTo = (page: number, force = false) => {
        if (!itemsContainer || page < 0 || page >= pagesCount() || (!force && activePage() === page)) return;

        setActivePage(page);
        translateItemsContainer();
        props.onActivePageChange?.(page);
        paginationRef?.changeIndex(page + 1);
    }

    const next = () => {
        const currentPage = activePage();
        if (currentPage < pagesCount() - 1) {
            scrollTo(currentPage + 1);
        }
    }

    const prev = () => {
        const currentPage = activePage();
        if (currentPage > 0) {
            scrollTo(currentPage - 1);
        }
    }

    const setItemsContainer = (el: HTMLDivElement) => {
        itemsContainer = el;
    }

    const setItemsWrapper = (el: HTMLDivElement) => {
        itemsWrapper = el;
    }

    const setPaginationRef = (el: PaginationRef) => {
        paginationRef = el;
    }

    const carouselClasses = createMemo(() => {
        const classes = [styles['carousel']];
        if (props.class) classes.push(props.class as string);
        return classes.join(' ');
    })

    props.componentClasses = () => carouselClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    return <CarouselContext.Provider value={{
        setActivePage,
        itemWidth,
        itemGap,
        setItems,
        setItemsContainer,
        setPaginationRef,
        activePage,
        pagesCount,
        scrollTo,
        next,
        prev,
        groupItems,
        setItemsWrapper
    }}>
        <div ref={carouselRef}
            class={className()}
            style={inlineStyles()}
            use:forwardEvents={props}
            use:forwardAttrs={props}
        >
            {props.children}
        </div>
    </CarouselContext.Provider>
}

export default Object.assign(Carousel, { Items: CarouselItems, Item, Pagination: CarouselPagination, Next: CarouselNext, Prev: CarouselPrev });