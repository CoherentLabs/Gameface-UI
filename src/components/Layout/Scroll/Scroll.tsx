import { Accessor, createContext, createSignal, onCleanup, onMount, ParentComponent } from 'solid-js';
import styles from './Scroll.module.css';
import LayoutBase from '../LayoutBase';
import { clamp } from '@components/utils/clamp';
import { Content, ScrollContent } from './ScrollContent';
import { Bar, ScrollBar } from './ScrollBar';
import { BaseComponentRef, ComponentBaseProps } from '@components/types/ComponentProps';
import { Handle } from './ScrollHandle';

export const ScrollContext = createContext<{
    scrollByClickHandler: (event: MouseEvent) => void,
    onHandleMouseDown: (event: MouseEvent) => void,
    handleHeight: Accessor<number>,
    handleTop: Accessor<number>
}>();

export interface ScrollComponentRef extends BaseComponentRef {
    scrollToElement: (element: HTMLElement | string) => void,
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
    onScroll?: OnScrollHandler
}

const Scroll: ParentComponent<ScrollProps> = (props) => {
    const [overflow, setOverflow] = createSignal(false);
    const [handleHeight, setHandleHeight] = createSignal(0);
    const [handleTop, setHandleTop] = createSignal(0);

    let containerRef: HTMLDivElement, contentRef: HTMLDivElement;
    let resizeObserver: ResizeObserver;
    let maxScroll: number, maxHandleMovement: number;
    let startY = 0, startScrollTop = 0, prevScrollTop = 0;

    function updateMeasurements() {
        const containerHeight = containerRef!.clientHeight;
        const contentHeight = contentRef!.scrollHeight;

        if (contentHeight > containerHeight) {
            setOverflow(true);

            const ratio = containerHeight / contentHeight;
            const newHandleHeight = containerHeight * ratio;
            setHandleHeight(newHandleHeight);

            maxScroll = contentHeight - containerHeight;
            maxHandleMovement = containerHeight - newHandleHeight;

            updateHandlePosition();
        } else {
            setOverflow(false);
            setHandleHeight(0);
            setHandleTop(0);
        }
    }

    function getScrollDirection(): ScrollDirections {
        if (maxScroll === contentRef!.scrollTop) return 'down';

        return prevScrollTop < contentRef!.scrollTop ? 'down' : 'up';
    }

    function handleOnScroll() {
        if (!props.onScroll) return;

        const eventData: OnScrollEventData = {
            scrollDirection: getScrollDirection()
        };

        prevScrollTop = contentRef!.scrollTop;
        props.onScroll(eventData);
    }

    function onHandleMouseDown(e: MouseEvent) {
        startY = e.clientY;
        startScrollTop = contentRef!.scrollTop;
        window.addEventListener('mousemove', onHandleMouseMove);
        window.addEventListener('mouseup', onHandleMouseUp);
    }

    function onHandleMouseMove(e: MouseEvent) {
        const deltaY = e.clientY - startY;

        if (deltaY === 0) return;

        const scrollDelta = (deltaY / maxHandleMovement) * maxScroll;

        contentRef!.scrollTop = startScrollTop + scrollDelta;
        updateHandlePosition();
    }

    function onHandleMouseUp() {
        window.removeEventListener('mousemove', onHandleMouseMove);
        window.removeEventListener('mouseup', onHandleMouseUp);
    }

    function updateHandlePosition() {
        const newHandleTop = maxScroll > 0 ? (contentRef!.scrollTop / maxScroll) * maxHandleMovement : 0;
        setHandleTop(clamp(newHandleTop, 0, maxHandleMovement));
        handleOnScroll();
    }

    function scrollToElement(element: HTMLElement | string) {
        if (!overflow()) return;

        if (typeof element === 'string') {
            element = contentRef!.querySelector(element) as HTMLElement;
        }

        if (element instanceof HTMLElement) {
            contentRef!.scrollTop = element.offsetTop;
            updateHandlePosition();
        }
    }

    function canScroll(direction: number) {
        const maxScrollTop = direction === 0 ? 0 : maxScroll;
        if (contentRef!.scrollTop === maxScrollTop || !overflow()) return false;
        return true;
    }

    function scrollWith(value: number, direction: number = 0) {
        if (!canScroll(direction)) return;
        contentRef!.scrollTop += value;
        updateHandlePosition();
    }

    function scrollTo(value: number, direction: number = 0) {
        if (!canScroll(direction)) return;
        contentRef!.scrollTop = value;
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

    const scrollObjectRef = {
        scrollToElement,
        scrollUp,
        scrollDown,
        begin,
        end
    };

    const scrollByClickHandler = (event: MouseEvent) => {
        if (event.target !== event.currentTarget) return;

        const scrollPosition = (event.clientY / maxHandleMovement) * maxScroll;

        contentRef!.scrollTop = scrollPosition;
        updateHandlePosition();
    };

    onMount(() => {
        resizeObserver = new ResizeObserver(updateMeasurements);

        if (contentRef!) {
            resizeObserver.observe(contentRef);

            contentRef!.addEventListener('scroll', updateHandlePosition);
        }
    });

    onCleanup(() => {
        if (resizeObserver) resizeObserver.disconnect();
        if (contentRef!) contentRef.removeEventListener('scroll', updateHandlePosition);
    });

    return (
        <ScrollContext.Provider value={{ scrollByClickHandler, onHandleMouseDown, handleHeight, handleTop }}>
            <LayoutBase {...props} refObject={scrollObjectRef}>
                <div ref={containerRef!} class={styles.Scroll}>
                    <ScrollContent ref={contentRef!} parentChildren={props.children} />
                    {overflow() && (<ScrollBar parentChildren={props.children} />)}
                </div>
            </LayoutBase>
        </ScrollContext.Provider>
    );
};

export default Object.assign(Scroll, { Content, Bar, Handle });