import { clamp } from "@components/utils/clamp";
import { Accessor, createContext, createEffect, createMemo, createSignal, on, onCleanup, onMount, ParentComponent } from "solid-js";
import styles from './XYSlider.module.scss';
import { Handle, XYSliderHandle } from "./XYSliderHandle";
import { Background, XYSliderBackground } from "./XYSliderBackground";
import { ComponentProps } from "@components/types/ComponentProps";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";
import { useNavigation } from "@components/Utility/Navigation/Navigation";

export type XYSliderValue = {
    x: number;
    y: number;
};

interface XYSliderProps extends ComponentProps {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
    step?: number;
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
    hasTransition: Accessor<boolean>
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
    // Gamepad navigation
    const step = () => props.step || 1;
    const maxBoost = createMemo(() => Math.max(maxX(), minX()) / 10 ); // 10% of max axis value
    const accelRate = createMemo(() => maxBoost() / 10);   // 10% of max boost
    let speedBoost = { x: 0, y: 0 };
    const nav = useNavigation();

    const [position, setPosition] = createSignal({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = createSignal(false);
    const [hasTransition, setHasTransition] = createSignal(true);

    const calculatePercentPosition = (pos: { x: number; y: number }) => ({
        x: ((pos.x - minX()) / (maxX() - minX())) * 100,
        y: ((pos.y - minY()) / (maxY() - minY())) * 100,
    });

    createEffect(
        on(
            () => [props.value?.x, props.value?.y, minX(), maxX(), minY(), maxY()],
            () => {
                const x = clamp(props.value?.x ?? (minX() + maxX()) / 2, minX(), maxX());
                const y = clamp(props.value?.y ?? (minY() + maxY()) / 2, minY(), maxY());
                setPosition(calculatePercentPosition({ x, y }));
                props.onChange?.({ x, y });
            },
            { defer: true }
        )
    );

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
        setHasTransition(false);

        const { left, top, width, height } = draggableArea.getBoundingClientRect();
        Object.assign(rect, { left, top, width, height });

        setIsDragging(true);
        handleDrag(e);

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    props.componentClasses = () => styles["XYSlider"];
    props.componentStyles = () => { return { cursor: isDragging() ? "pointer" : "auto" } };

    const changeValue = (newValue: XYSliderValue) => {
        const x = clamp(newValue.x, minX(), maxX());
        const y = clamp(newValue.y, minY(), maxY());
        setPosition(calculatePercentPosition({ x, y }));
        props.onChange?.({ x, y });
    }

    onMount(() => {
        if (nav) nav.resumeAction('pan');
        
        if (!props.ref || !draggableArea) return;

        (props.ref as unknown as (ref: any) => void)({
            value: position,
            element: draggableArea,
            changeValue
        });
    });

    onCleanup(() => {
        if (nav) nav.pauseAction('pan');
        handleMouseUp()
    })

    const defaultActions = {
        'pan': (_: any, axes: [number, number]) => {
            const [inputX, inputY] = axes;

            // Deadzone check
            if (Math.abs(inputX) < 0.1 && Math.abs(inputY) < 0.1) {
                speedBoost = { x: 0, y: 0 };
                return;
            }

            const currentPosPercent = position(); // This is 0-100
            const baseStep = step();
            const rangeX = maxX() - minX();
            const rangeY = maxY() - minY();
            const currentRawX = minX() + (currentPosPercent.x / 100) * rangeX;
            const currentRawY = minY() + (currentPosPercent.y / 100) * rangeY;

            if (inputX !== 0) speedBoost.x = Math.min(speedBoost.x + accelRate(), maxBoost());
            if (inputY !== 0) speedBoost.y = Math.min(speedBoost.y + accelRate(), maxBoost());

            // FORMULA: Input (0-1) * Step (Base) * (1 + Boost)
            const deltaX = inputX * baseStep * (1 + speedBoost.x);
            const deltaY = inputY * baseStep * (1 + speedBoost.y);

            if (!hasTransition()) setHasTransition(true);

            changeValue({
                x: currentRawX + deltaX,
                y: currentRawY + deltaY
            });
        },
    }

    return (
        <XYSliderContext.Provider value={{ position, hasTransition }}>
            <div ref={draggableArea}
                use:baseComponent={props}
                use:navigationActions={mergeNavigationActions(props, defaultActions)}
                onMouseDown={handleMouseDown}
            >
                <XYSliderBackground parentChildren={props.children} />
                <XYSliderHandle parentChildren={props.children}></XYSliderHandle>
            </div>
        </XYSliderContext.Provider>
    );
};

export default Object.assign(XYSlider, { Handle, Background });