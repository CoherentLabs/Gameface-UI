import { createSignal, onCleanup, onMount, ParentComponent } from "solid-js";
import styles from './Scroll.module.css';
import LayoutBase from "../LayoutBase";
import { clamp } from "../../utils/clamp";
import { BaseComponentRef, ComponentBaseProps } from "../../types/ComponentProps";

export interface ScrollComponentRef extends BaseComponentRef {
    scrollToElement: (element: HTMLElement | string) => void,
    scrollUp: () => void,
    scrollDown: () => void,
    end: () => void,
    begin: () => void,
}

export type OnScrollHandler = (arg: OnScrollEventData) => void;

interface OnScrollEventData {
    scrollDirection: 'up' | 'down';
}

interface ScrollProps extends ComponentBaseProps {
    ref?: ScrollComponentRef,
    onScroll?: OnScrollHandler,
}

const Scroll: ParentComponent<ScrollProps> = (props) => {
    const [overflow, setOverflow] = createSignal(false);
    const [handleHeight, setHandleHeight] = createSignal(0);
    const [handleTop, setHandleTop] = createSignal(0);
    let containerRef: HTMLDivElement, contentRef: HTMLDivElement;
    let resizeObserver: ResizeObserver;
    let maxScroll: number, maxHandleMovement: number
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

    function getScrollDirection(): 'up' | 'down' {
        if (maxScroll === contentRef!.scrollTop) return 'down';

        return prevScrollTop < contentRef!.scrollTop ? 'down' : 'up'
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
        window.addEventListener("mousemove", onHandleMouseMove);
        window.addEventListener("mouseup", onHandleMouseUp);
    }

    function onHandleMouseMove(e: MouseEvent) {
        const deltaY = e.clientY - startY;

        if(deltaY === 0) return;

        const scrollDelta = (deltaY / maxHandleMovement) * maxScroll;

        contentRef!.scrollTop = startScrollTop + scrollDelta;
        updateHandlePosition();
        handleOnScroll()
    }

    function onHandleMouseUp() {
        window.removeEventListener("mousemove", onHandleMouseMove);
        window.removeEventListener("mouseup", onHandleMouseUp);
    }

    function updateHandlePosition() {
        const newHandleTop = maxScroll > 0 ? (contentRef!.scrollTop / maxScroll) * maxHandleMovement : 0;
        setHandleTop(clamp(newHandleTop, 0, maxHandleMovement));
    }

    function scrollToElement(element: HTMLElement | string) {
        if (!overflow()) return;

        if (typeof element === 'string') {
            element = contentRef!.querySelector(`.${element}`) as HTMLElement
        }

        if (element instanceof HTMLElement) {
            contentRef!.scrollTop = element.offsetTop
            updateHandlePosition();
            handleOnScroll()
        }
    }

    function scrollUp() {
        if (contentRef!.scrollTop === 0 || !overflow()) return;

        contentRef!.scrollTop -= 100;
        updateHandlePosition();
        handleOnScroll()
    }

    function scrollDown() {
        if (contentRef!.scrollTop === maxScroll || !overflow()) return;

        contentRef!.scrollTop += 100;
        updateHandlePosition();
        handleOnScroll()
    }

    function begin() {
        if (contentRef!.scrollTop === 0 || !overflow()) return;

        contentRef!.scrollTop = 0;
        updateHandlePosition();
        handleOnScroll()
    }

    function end() {
        if (contentRef!.scrollTop === maxScroll || !overflow()) return;

        contentRef!.scrollTop = maxScroll;
        updateHandlePosition();
        handleOnScroll()
    }

    const scrollObjectRef = {
        scrollToElement,
        scrollUp,
        scrollDown,
        begin,
        end
    }

    onMount(() => {
        resizeObserver = new ResizeObserver(updateMeasurements);
        
        if (contentRef!) resizeObserver.observe(contentRef);
        
        contentRef!.addEventListener("scroll", () => {
            updateHandlePosition()
            handleOnScroll()
        });
    });

    onCleanup(() => {
        if (resizeObserver) resizeObserver.disconnect();
        if (contentRef!) contentRef.removeEventListener("scroll", updateHandlePosition);
    });

    return (
        <LayoutBase {...props} refObject={scrollObjectRef} >
            <div ref={containerRef!} class={styles.Scroll}>
                <div ref={contentRef!} class={styles.Content}>{props.children}</div>
                {overflow() && (
                    <div class={styles.ScrollBar}>
                        <div 
                            onMouseDown={onHandleMouseDown} 
                            class={styles.Handle} 
                            style={{ height: `${handleHeight()}px`, top: `${handleTop()}px` }}>
                        </div>
                    </div>
                )}
            </div>
        </LayoutBase>
    )
}

export default Scroll;