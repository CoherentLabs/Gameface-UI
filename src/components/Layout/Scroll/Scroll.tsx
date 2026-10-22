import { Accessor, createContext, createEffect, createSignal, onCleanup, onMount, ParentComponent, on, mergeProps } from 'solid-js';
import styles from './Scroll.module.scss';
import LayoutBase from '../LayoutBase';
import { clamp } from '@components/utils/clamp';
import { Content, ScrollContent } from './ScrollContent';
import { Bar, ScrollBar } from './ScrollBar';
import { BaseComponentRef, ComponentBaseProps } from '@components/types/ComponentProps';
import { Handle } from './ScrollHandle';
import { useNavigation } from '@components/Utility/Navigation/Navigation';
import isString from '@components/utils/isString';

export const ScrollContext = createContext<{
    scrollToMouseHandler: (event: MouseEvent) => void,
    updateMeasurements: () => void,
    stopScrollingToMouse: () => void,
    onHandleMouseDown: (event: MouseEvent) => void,
    handleHeight: Accessor<number>,
    handleTop: Accessor<number>
    overflow: Accessor<boolean>
    scrollTop: Accessor<number>
    viewportHeight: Accessor<number>
    contentWidth: Accessor<number>
    scrollToPosition: (value: number) => void
}>();

export interface ScrollComponentRef extends BaseComponentRef {
    scrollToElement: (element: HTMLElement | string) => void,
    scrollIntoView: (element: HTMLElement | string) => void,
    scrollUp: () => void,
    scrollDown: () => void,
    end: () => void,
    begin: () => void,
}

export type OnScrollHandler = (arg: OnScrollEventData) => void;

type ScrollDirections = 'up' | 'down';

interface OnScrollEventData {
    scrollDirection: ScrollDirections;
}

interface ScrollProps extends ComponentBaseProps {
    ref?: ScrollComponentRef,
    onScroll?: OnScrollHandler,
    minHandleSize?: number
}

const Scroll: ParentComponent<ScrollProps> = (props) => {
    const [overflow, setOverflow] = createSignal(false);
    const [handleHeight, setHandleHeight] = createSignal(0);
    const [handleTop, setHandleTop] = createSignal(0);
    const [scrollTop, setScrollTop] = createSignal(0);
    const [viewportHeight, setViewportHeight] = createSignal(0);
    const [contentWidth, setContentWidth] = createSignal(0);

    let containerRef: HTMLDivElement, contentWrapperRef: HTMLDivElement;
    let maxScroll: number, maxHandleMovement: number;
    let startY = 0, startScrollTop = 0, prevScrollTop = 0;
    let scrollStep = 100;
    let scrollToMouseInterval: NodeJS.Timeout;
    let scrollToMouseTimeout: NodeJS.Timeout;
    const nav = useNavigation();

    function updateMeasurements() {
        const containerHeight = containerRef!.clientHeight;
        const contentHeight = contentWrapperRef!.scrollHeight;
        setViewportHeight(containerHeight);
        // The inner content element excludes the wrapper's scrollbar padding
        const inner = contentWrapperRef!.firstElementChild as HTMLElement | null;
        setContentWidth(inner ? inner.clientWidth : contentWrapperRef!.clientWidth);

        if (contentHeight > containerHeight) {
            setOverflow(true);

            const ratio = containerHeight / contentHeight;
            const newHandleHeight = Math.min(containerHeight, Math.max(containerHeight * ratio, props.minHandleSize ?? 24));
            setHandleHeight(newHandleHeight);

            maxScroll = contentHeight - containerHeight;
            maxHandleMovement = containerHeight - newHandleHeight;
            scrollStep = Math.max(scrollStep, Math.floor(maxScroll / 20));

            updateHandlePosition();
        } else {
            setOverflow(false);
            setHandleHeight(0);
            setHandleTop(0);
            setScrollTop(contentWrapperRef!.scrollTop);
        }
    }

    function getScrollDirection(): ScrollDirections {
        if (maxScroll === contentWrapperRef!.scrollTop) return 'down';

        return prevScrollTop < contentWrapperRef!.scrollTop ? 'down' : 'up';
    }

    function handleOnScroll() {
        if (!props.onScroll) return;

        const eventData: OnScrollEventData = {
            scrollDirection: getScrollDirection()
        };

        prevScrollTop = contentWrapperRef!.scrollTop;
        props.onScroll(eventData);
    }

    function onHandleMouseDown(e: MouseEvent) {
        startY = e.clientY;
        startScrollTop = contentWrapperRef!.scrollTop;
        window.addEventListener('mousemove', onHandleMouseMove);
        window.addEventListener('mouseup', onHandleMouseUp);
    }

    function onHandleMouseMove(e: MouseEvent) {
        const deltaY = e.clientY - startY;

        if (deltaY === 0) return;

        const scrollDelta = (deltaY / maxHandleMovement) * maxScroll;

        contentWrapperRef!.scrollTop = startScrollTop + scrollDelta;
        updateHandlePosition();
    }

    function onHandleMouseUp() {
        window.removeEventListener('mousemove', onHandleMouseMove);
        window.removeEventListener('mouseup', onHandleMouseUp);
    }

    function updateHandlePosition() {
        setScrollTop(contentWrapperRef!.scrollTop);
        const newHandleTop = maxScroll > 0 ? (contentWrapperRef!.scrollTop / maxScroll) * maxHandleMovement : 0;
        setHandleTop(clamp(newHandleTop, 0, maxHandleMovement));
    }

    function scrollToElement(element: HTMLElement | string) {
        if (!overflow()) return;

        if (isString(element)) {
            element = contentWrapperRef!.querySelector(element) as HTMLElement;
        }

        if (element instanceof HTMLElement) {
            contentWrapperRef!.scrollTop = element.offsetTop;
            updateHandlePosition();
        }
    }

    function canScroll(direction: number) {
        const maxScrollTop = direction === 0 ? 0 : maxScroll;
        if (contentWrapperRef!.scrollTop === maxScrollTop || !overflow()) return false;
        return true;
    }

    function scrollWith(value: number, direction: number = 0) {
        if (!canScroll(direction)) return;
        contentWrapperRef!.scrollTop += value;
        updateHandlePosition();
    }

    function scrollTo(value: number, direction: number = 0) {
        if (!canScroll(direction)) return;
        contentWrapperRef!.scrollTop = value;
        updateHandlePosition();
    }

    // Unconditional scroll used by virtualized content - the DOM clamps the value
    function scrollToPosition(value: number) {
        contentWrapperRef!.scrollTop = value;
        updateHandlePosition();
    }

    function scrollUp() {
        scrollWith(-100);
    }

    function scrollDown() {
        scrollWith(100, 1);
    }

    function begin() {
        scrollTo(0);
    }

    function end() {
        scrollTo(maxScroll, 1);
    }

    function scrollIntoView(element: HTMLElement | string) {
        if (!overflow()) return;

        if (isString(element)) {
            element = contentWrapperRef!.querySelector(element) as HTMLElement
        }

        if (!element) return;

        // Current scrollable container info
        const contentTop = contentWrapperRef!.scrollTop;
        const contentHeight = contentWrapperRef!.clientHeight;
        const contentBottom = contentTop + contentHeight;

        // Element’s bounding info relative to the scroll container
        const elTop = element.offsetTop;
        const elHeight = element.offsetHeight;
        const elBottom = elTop + elHeight;

        // If the element is already in view, do nothing
        if (elTop >= contentTop && elBottom <= contentBottom) {
            return;
        }

        // If element is above the current view, scroll so that element is at the top
        if (elTop < contentTop) {
            scrollTo(elTop, 0);
        }
        // If element is below the current view, scroll so element’s bottom is aligned with the container’s bottom
        else if (elBottom > contentBottom) {
            const newScrollTop = elBottom - contentHeight;
            scrollTo(newScrollTop, 1);
        }
    }

    const scrollObjectRef = {
        scrollToElement,
        scrollIntoView,
        scrollUp,
        scrollDown,
        begin,
        end,
    };

    const scrollToMousePositionWithStep = (clickPosition: number) => {
        const handleCenter = handleTop() + handleHeight() / 2;
        const hasReachedHandle = Math.abs(clickPosition - handleCenter) < handleHeight() / 2;
        if (hasReachedHandle) return true;

        if (clickPosition < handleCenter) {
            contentWrapperRef!.scrollTop -= scrollStep;
        } else {
            contentWrapperRef!.scrollTop += scrollStep;
        }

        updateHandlePosition();
    }

    const scrollToMouseHandler = (event: MouseEvent) => {
        if (event.target !== event.currentTarget) return;
        const barRect = containerRef!.getBoundingClientRect();
        const clickPosition = event.clientY - barRect.top;
        scrollToMousePositionWithStep(clickPosition);

        scrollToMouseTimeout = setTimeout(() => {
            scrollToMouseInterval = setInterval(() => {
                const hasScrolledToMouse = scrollToMousePositionWithStep(clickPosition);
                if (hasScrolledToMouse) stopScrollingToMouse();
            }, 20);
        }, 200);
    };

    const stopScrollingToMouse = () => {
        if (scrollToMouseTimeout) clearTimeout(scrollToMouseTimeout);
        if (scrollToMouseInterval) clearInterval(scrollToMouseInterval);
    }

    createEffect(on(handleTop, handleOnScroll, {defer: true}))

    const handleFocusIn = (e: FocusEvent) => {
        if (props.focusin) return props.focusin(e);

        if (nav) scrollIntoView(e.target as HTMLDivElement);
    }

    const defaultActions = {
        'pan': (_: any,[x, y]: number[]) => {
            const value = Math.round(y * 100);
            // TRESHOLD CHECK
            if (Math.abs(value) < 10) return;

            const direction = value < 0 ? 0 : 1;
            scrollWith(value, direction)
        },
    }

    // Not assigned back to props - props passed through spreads only have getters
    const onAction = mergeProps(defaultActions, props.onAction);

    let containerObserver: ResizeObserver | undefined;

    onMount(() => {
        // The content observer misses container-only size changes (e.g. resolution changes)
        containerObserver = new ResizeObserver(updateMeasurements);
        containerObserver.observe(containerRef!);
        contentWrapperRef!.addEventListener('scroll', updateHandlePosition);
        contentWrapperRef!.addEventListener('property-scroll', updateHandlePosition)
        if (nav) nav.resumeAction('pan');
    });

    onCleanup(() => {
        containerObserver?.disconnect();
        if (contentWrapperRef!) {
            contentWrapperRef.removeEventListener('scroll', updateHandlePosition);
            contentWrapperRef.removeEventListener('property-scroll', updateHandlePosition);
        }
        stopScrollingToMouse();
        if (nav) nav.pauseAction('pan');
    });

    return (
        <ScrollContext.Provider value={{ scrollToMouseHandler, stopScrollingToMouse, updateMeasurements, onHandleMouseDown, handleHeight, handleTop, overflow, scrollTop, viewportHeight, contentWidth, scrollToPosition }}>
            <LayoutBase focusin={handleFocusIn} {...props} onAction={onAction} refObject={scrollObjectRef} >
                <div ref={containerRef!} class={styles.scroll}>
                    <ScrollContent ref={contentWrapperRef!} parentChildren={props.children} />
                    <ScrollBar parentChildren={props.children} />
                </div>
            </LayoutBase>
        </ScrollContext.Provider>
    );
};

export default Object.assign(Scroll, { Content, Bar, Handle });