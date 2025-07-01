import { clamp } from "@components/utils/clamp";
import { Accessor, createContext, createEffect, createMemo, createSignal, onMount, ParentComponent } from "solid-js";
import styles from './XYSlider.module.css';
import { Handle, XYSliderHandle } from "./XYSliderHandle";
import { Background, XYSliderBackground } from "./XYSliderBackground";
import { ComponentProps } from "@components/types/ComponentProps";
import useBaseComponent from "@components/BaseComponent/BaseComponent";

type XYSliderValue = {
    x: number;
    y: number;
};

interface XYSliderProps extends ComponentProps {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
    value?: XYSliderValue;
    onChange?: (value: XYSliderValue) => void;
}

export interface XYSliderRef {
    value: Accessor<XYSliderValue>,
    element: HTMLDivElement,
    changeValue: (newValue: XYSliderValue) => void
}

interface XYSliderContext {
    position: () => XYSliderValue;
}

export const XYSliderContext = createContext<XYSliderContext>();

const XYSlider: ParentComponent<XYSliderProps> = (props) => {
    let draggableArea!: HTMLDivElement;

    const rect = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
    };
    const minX = () => props.minX || 0;
    const maxX = () => props.maxX || 100;
    const minY = () => props.minY || 0;
    const maxY = () => props.maxY || 100;

    const [position, setPosition] = createSignal({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = createSignal(false);

    const calculatePercentPosition = (pos: { x: number; y: number }) => ({
        x: ((pos.x - minX()) / (maxX() - minX())) * 100,
        y: ((pos.y - minY()) / (maxY() - minY())) * 100,
    });

    createEffect(() => {
        const x = clamp(props.value?.x ?? (minX() + maxX()) / 2, minX(), maxX());
        const y = clamp(props.value?.y ?? (minY() + maxY()) / 2, minY(), maxY());
        setPosition(calculatePercentPosition({ x, y }));
        props.onChange?.({ x, y });
    });

    const calculatePositionFromMouse = (e: MouseEvent) => {
        const x = clamp(e.clientX - rect.left, 0, rect.width);
        const y = clamp(e.clientY - rect.top, 0, rect.height);

        const mappedX = minX() + (x / rect.width) * (maxX() - minX());
        const mappedY = minY() + (y / rect.height) * (maxY() - minY());

        return { x: mappedX, y: mappedY };
    };

    const handleDrag = (e: MouseEvent) => {
        const newPosition = calculatePositionFromMouse(e);
        setPosition(calculatePercentPosition(newPosition));
        props.onChange?.(newPosition);
    };

    const handleMouseMove = (e: MouseEvent) => {
        handleDrag(e);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const { left, top, width, height } = draggableArea.getBoundingClientRect();
        Object.assign(rect, { left, top, width, height });

        setIsDragging(true);
        handleDrag(e);

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    props.componentClasses = () => styles["XYSlider"];
    props.componentStyles = () => { return { cursor: isDragging() ? "pointer" : "auto" } };
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    const changeValue = (newValue: XYSliderValue) => {
        const x = clamp(newValue.x, minX(), maxX());
        const y = clamp(newValue.y, minY(), maxY());
        setPosition(calculatePercentPosition({ x, y }));
        props.onChange?.({ x, y });
    }

    onMount(() => {
        if (!props.ref || !draggableArea) return;

        (props.ref as unknown as (ref: any) => void)({
            value: position,
            element: draggableArea,
            changeValue
        });
    });

    return (
        <XYSliderContext.Provider value={{ position }}>
            <div ref={draggableArea}
                class={className()}
                style={inlineStyles()}
                onMouseDown={handleMouseDown}
                use:forwardEvents={props}
                use:forwardAttrs={props}
            >
                <XYSliderBackground parentChildren={props.children} />
                <XYSliderHandle parentChildren={props.children}></XYSliderHandle>
            </div>
        </XYSliderContext.Provider>
    );
};

export default Object.assign(XYSlider, { Handle, Background });