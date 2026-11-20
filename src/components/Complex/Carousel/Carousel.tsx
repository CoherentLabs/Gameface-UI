import { PaginationRef } from "@components/Basic/Pagination/Pagination";
import { createContext, createEffect, createMemo, createSignal, onSettled, ParentComponent, ParentProps, Setter } from "solid-js";
import CarouselItems, { CarouselItemTokenProps, Item } from "./CarouselItems";
import CarouselPagination from "./CarouselPagination";
import { CarouselNext } from "./CarouselNext";
import { CarouselPrev } from "./CarouselPrev";
import { waitForFrames } from "@components/utils/waitForFrames";
import { ComponentProps } from "@components/types/ComponentProps";
import styles from './Carousel.module.scss';
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";

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

type CarouselItemData = ParentProps<CarouselItemTokenProps & { _id: string }>;

interface CarouselContextType {
    itemWidth: () => number;
    itemGap: () => number;
    setActivePage: (page: number) => void;
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

// Null default: Solid 2 throws when a context without a default is read outside its provider.
export const CarouselContext = createContext<CarouselContextType | null>(null);

const Carousel: ParentComponent<CarouselProps> = (props) => {
    let itemsWrapper!: HTMLDivElement;
    let itemsContainer!: HTMLDivElement;
    let paginationRef!: PaginationRef;
    let carouselRef!: HTMLDivElement;

    const [items, setItems] = createSignal<CarouselItemData[]>([]);

    // Solid 2 stages writes: a signal read right after its write still returns the old value until the
    // next flush. The page logic below (and the ref API: next/prev/scrollTo) writes and then reads in the
    // same step, so each value also lives in a plain, always-current copy (the navigationState.ts pattern):
    // writes go to both, reads subscribe to the signal and return the copy.
    let activePageNow = 0;
    let pagesCountNow = 0;
    const [activePageSignal, setActivePageSignal] = createSignal(0);
    const [pagesCountSignal, setPagesCountSignal] = createSignal(0);
    const activePage = () => { activePageSignal(); return activePageNow; };
    const pagesCount = () => { pagesCountSignal(); return pagesCountNow; };
    const setActivePage = (page: number) => { activePageNow = page; setActivePageSignal(page); };
    const setPagesCount = (count: number) => { pagesCountNow = count; setPagesCountSignal(count); };

    const itemWidth = createMemo(() => props.itemWidth || 100);
    const itemGap = createMemo(() => props.itemGap || 0);
    const itemsAlignment = createMemo(() => props.itemsAlignment || 'start');
    const groupItems = createMemo(() => !!props.groupItems);
    const leadingAndTrailingSpaces = createMemo(() => props.leadingAndTrailingSpaces === false ? false : true);

    createEffect(() => [itemWidth(), itemGap(), groupItems()], () => {
        updatePagesCount();
    }, { defer: true });

    const resolveActivePageIndex = (
        currentItems: CarouselItemData[],
        previousItems: CarouselItemData[] | undefined,
        previousActivePage: number
    ): number => {
        if (!previousItems) return previousActivePage;

        const previouslyActiveItem = previousItems[previousActivePage];
        if (!previouslyActiveItem?._id) return previousActivePage;

        // Find the new index of the previously active item in the current list
        const newIndex = currentItems.findIndex(
            (item) => item._id === previouslyActiveItem._id
        );

        // If the item still exists, return its new index, otherwise keep the old page
        return newIndex >= 0 ? newIndex : previousActivePage;
    };

    // The items as of the previous run (1.x `on(items, (current, previous) => …)` semantics).
    let previousItems: CarouselItemData[] = [];
    createEffect(() => items(), (currentItems) => {
        const prevItems = previousItems;
        previousItems = currentItems;

        // Check if a new item was just added with `selected`
        const newlySelectedIndex = currentItems.findIndex((item) => {
            const existedBefore = prevItems.some(
                (prevItem) => prevItem._id === item._id
            );
            return item.selected && !existedBefore;
        });

        let nextActivePage: number;

        if (newlySelectedIndex >= 0) {
            // Prioritize explicitly selected new items
            nextActivePage = newlySelectedIndex;
            setActivePage(nextActivePage);
        } else {
            // Otherwise, keep the previous active item if it still exists
            nextActivePage = groupItems()
                ? activePage()
                : resolveActivePageIndex(currentItems, prevItems, activePage());
        }

        updatePagesCount();
        scrollTo(nextActivePage, true);
    }, { defer: true });

    createEffect(() => [itemsAlignment(), leadingAndTrailingSpaces()], () => {
        waitForFrames(translateItemsContainer);
    }, { defer: true });

    onSettled(() => {
        waitForFrames(translateItemsContainer);

        const resizeObserver = new ResizeObserver(translateItemsContainer);
        if (carouselRef) resizeObserver.observe(carouselRef);

        return () => resizeObserver.disconnect();
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

        // eslint-disable-next-line solid/reactivity -- runs once a few frames later and reads the current sizes; nothing should re-run it
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

    // The page last reported through onActivePageChange. A forced scroll (the items changed) re-positions the
    // container but reports only when the active index really changed (1.x reported it on every items change).
    let reportedPage = 0;
    const scrollTo = (page: number, force = false) => {
        if (!itemsContainer || page < 0 || page >= pagesCount() || (!force && activePage() === page)) return;

        setActivePage(page);
        translateItemsContainer();
        if (page !== reportedPage) {
            reportedPage = page;
            props.onActivePageChange?.(page);
        }
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

    return <CarouselContext value={{
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
        <div
            class={[styles['carousel'], props.class]}
            style={props.style}
            ref={[
                (el: HTMLDivElement) => { carouselRef = el; },
                exposeRef<Omit<CarouselRef, 'element'>>(props, {
                    // A getter: Carousel.Items sets the container after this ref runs.
                    get itemsContainer() { return itemsContainer; },
                    next,
                    prev,
                    scrollTo,
                    activePage,
                    pagesCount,
                    translateItemsContainer,
                }),
                baseComponent(props),
                navigationActions({
                    anchor: props.anchor,
                    ...props.onAction,
                }),
            ]}>
            {props.children}
        </div>
    </CarouselContext>
}

export default Object.assign(Carousel, { Items: CarouselItems, Item, Pagination: CarouselPagination, Next: CarouselNext, Prev: CarouselPrev });
