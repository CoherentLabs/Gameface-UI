import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, Setter, createSignal, onMount, ParentComponent, Show, createContext, createMemo, createEffect, For } from "solid-js";
import styles from './Slider.module.css';
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { clamp } from "@components/utils/clamp";
import { Grid, SliderGrid } from "./SliderGrid";
import { Fill, SliderFill } from "./SliderFill";
import { Handle, SliderHandle } from "./SliderHandle";
import { SliderThumb, Thumb } from "./SliderThumb";
import { SliderTrack, Track } from "./SliderTrack";
import { useToken } from "@components/utils/tokenComponents";

export interface SliderRef {
    value: Accessor<number>,
    element: HTMLDivElement,
    changeValue: (newValue: number) => void 
}

interface SliderProps extends ComponentProps {
    value: number,
    min: number,
    max: number,
    step: number,
    orientation?: 'horizontal' | 'vertical',
    onChange?: (value: number) => void;
}

interface SliderContext {
    value: Accessor<number>,
    percent: () => number;
    isVertical: boolean;
}

export const SliderContext = createContext<SliderContext>();

const Slider: ParentComponent<SliderProps> = (props) => {
    const [value, setValue] = createSignal(clamp(props.value, props.min, props.max));
    const [sliding, setSliding] = createSignal(false);
    const percent = () => ((value() - props.min) / (props.max - props.min)) * 100;
    const isVertical = props.orientation === 'vertical';

    let element!: HTMLDivElement;
    let trackElement!: HTMLDivElement;
    let start: number,
        maxValue: number,
        minValue: number,
        pixelRange: number,
        startValue: number;
    let hasDragged = false;

    const ThumbSlot = useToken(Thumb, props.children)
    const GridSlot = useToken(Grid, props.children)

    const handleTrackClick = (e: MouseEvent) => {
        if (hasDragged) {
            hasDragged = false;
            return;
        }

        calculateInitialValues(e);
        const offSet = isVertical ?  props.max : props.min;
        const valueRange = isVertical ? (props.min - props.max) : (props.max - props.min);

        const delta = start - minValue;
        const newValue = offSet + (delta / pixelRange) * valueRange;
        const result = Math.round(clamp(Math.round(newValue / props.step) * props.step, props.min, props.max));

        setValue(result);
        props.onChange?.(result);
    }

    const handleMouseDown = (e: MouseEvent) => {
        setSliding(true);
        hasDragged = false;

        calculateInitialValues(e);
        startValue = value();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!sliding()) return;

        const result = Math.round(calculateResult(e, props.orientation === 'vertical'));
        setValue(result);
        props.onChange?.(result);
    }
    
    const handleMouseUp = (e: MouseEvent) => {
        if (!sliding()) return;
        
        hasDragged = true;
        setSliding(false);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }

    const calculateResult = (e: MouseEvent, isVertical: boolean) => {
        const delta = (isVertical ? e.clientY : e.clientX) - start;
        const valueRange = isVertical ? (props.min - props.max) : (props.max - props.min);

        const deltaValue = (delta / pixelRange) * valueRange
        const newValue = startValue + deltaValue;

        return clamp(Math.round(newValue / props.step) * props.step, props.min, props.max);
    }

    const SliderClasses = createMemo(() => {
        const classes = [styles.Slider];

        if (isVertical) classes.push(styles.Vertical)
        if (ThumbSlot()) classes.push(styles['With-Thumb'])
        if (GridSlot()) classes.push(styles['With-Grid'])

        return classes.join(' ');
    });

    const calculateInitialValues = (e: MouseEvent) => {
        const { top, left, width, height } = trackElement.getBoundingClientRect();

        if (isVertical) {
            start = e.clientY;
            minValue = top
            maxValue = top + height;
            pixelRange = maxValue - minValue;
            return;
        }
 
        start = e.clientX;
        minValue = left
        maxValue = left + width;
        pixelRange = maxValue - minValue;
    }

    const changeValue = (newValue: number) => {
        const clampedValue = clamp(newValue, props.min, props.max);

        setValue(clampedValue);
        props.onChange?.(clampedValue);
    }
 
    props.componentClasses = () => SliderClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            value: props.value,
            element,
            changeValue
        });
    });

    return (
        <SliderContext.Provider value={{ value, percent, isVertical }}>
            <div
                ref={element!}
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props}
                use:forwardAttrs={props}>
                    <SliderTrack handleClick={handleTrackClick} ref={trackElement} parentChildren={props.children}>
                        <SliderHandle handleMouseDown={handleMouseDown} parentChildren={props.children} />
                        <SliderFill parentChildren={props.children} />
                        <SliderThumb parentChildren={props.children} />
                    </SliderTrack>
                    <SliderGrid min={props.min} max={props.max} parentChildren={props.children} />
            </div>
        </SliderContext.Provider>
    )
}

export default Object.assign(Slider, {Grid, Fill, Handle, Thumb, Track});