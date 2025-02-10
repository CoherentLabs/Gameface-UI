import { createSignal, onCleanup, onMount, ParentComponent } from "solid-js";
import styles from './Scroll.module.css';
import ComponentBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";
import { clamp } from "../../utils/clamp";
import { BaseComponentRef } from "../../types/ComponentProps";

export interface ScrollComponentRef extends BaseComponentRef {
    scrollToElement: (element: HTMLElement | string) => void,
    scrollUp: () => void,
    scrollDown: () => void,
    end: () => void,
    begin: () => void,
}

interface ScrollProps extends ComponentBaseProps {
    ref?: ScrollComponentRef,
}

const Scroll: ParentComponent<ScrollProps> = (props) => {
    const [overflow, setOverflow] = createSignal(false);
    const [handleHeight, setHandleHeight] = createSignal(0);
    const [handleTop, setHandleTop] = createSignal(0);
    let containerRef: HTMLDivElement, contentRef: HTMLDivElement;
    let resizeObserver: ResizeObserver;
    let maxScroll: number, maxHandleMovement: number
    let startY = 0, startScrollTop = 0;

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

    function onHandleMouseDown(e: MouseEvent) {
        startY = e.clientY;
        startScrollTop = contentRef!.scrollTop;
        window.addEventListener("mousemove", onHandleMouseMove);
        window.addEventListener("mouseup", onHandleMouseUp);
    }

    function onHandleMouseMove(e: MouseEvent) {
        const deltaY = e.clientY - startY;
        const scrollDelta = (deltaY / maxHandleMovement) * maxScroll;

        contentRef!.scrollTop = startScrollTop + scrollDelta;
        updateHandlePosition();
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
        if (typeof element === 'string') {
            element = document.querySelector(`.${element}`) as HTMLElement
        }

        if (element instanceof HTMLElement) {
            contentRef!.scrollTop = element.offsetTop
            updateHandlePosition();
        } else {
            console.error("Invalid element provided to scrollToElement");
        }
    }

    function scrollUp() {
        contentRef!.scrollTop -= 100;
        updateHandlePosition();
    }

    function scrollDown() {
        contentRef!.scrollTop += 100;
        updateHandlePosition();
    }

    function begin() {
        contentRef!.scrollTop = 0;
        updateHandlePosition();
    }

    function end() {
        contentRef!.scrollTop = contentRef!.scrollHeight;
        updateHandlePosition();
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

        if (containerRef!) resizeObserver.observe(containerRef);
        if (contentRef!) resizeObserver.observe(contentRef);

        contentRef!.addEventListener("scroll", updateHandlePosition);
    });

    onCleanup(() => {
        if (resizeObserver) resizeObserver.disconnect();
        if (contentRef!) contentRef.removeEventListener("scroll", updateHandlePosition);
    });

    return (
        <LayoutBase {...props} refObject={scrollObjectRef} >
            <div ref={containerRef!} class={styles.Scroll} style={props.style}>
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