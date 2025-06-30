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
    value?: number,
    min?: number,
    max?: number,
    step?: number,
    onChange?: (value: number) => void;
}

interface SliderContext {
    value: Accessor<number>,
    percent: () => number;
}

export const SliderContext = createContext<SliderContext>();

const Slider: ParentComponent<SliderProps> = (props) => {
    const min = () => props.min || 0;
    const max = () => props.max || 100;
    const step = () => props.step || 1;
    const [value, setValue] = createSignal(clamp(props.value || 50, min(), max()));
    const percent = () => ((value() - min()) / (max() - min())) * 100;

    let element!: HTMLDivElement;
    let trackElement!: HTMLDivElement;
    let sliding = false;
    let start: number,
        maxValue: number,
        minValue: number,
        pixelRange: number,
        startValue: number;

    const ThumbSlot = useToken(Thumb, props.children)
    const GridSlot = useToken(Grid, props.children)

    const handleTrackClick = (e: MouseEvent) => {
        calculateInitialValues(e);
        const valueRange = max() - min();
        const delta = start - minValue;
        const newValue = min() + (delta / pixelRange) * valueRange;
        const result = Math.round(clamp(Math.round(newValue / step()) * step(), min(), max()));

        setValue(result);
        props.onChange?.(result);
    }

    const handleMouseDown = (e: MouseEvent) => {
        e.stopImmediatePropagation();
        sliding = true;

        calculateInitialValues(e);
        startValue = value();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!sliding) return;

        const result = Math.round(calculateResult(e));
        setValue(result);
        props.onChange?.(result);
    }
    
    const handleMouseUp = (e: MouseEvent) => {
        if (!sliding) return;
        
        sliding = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }

    const calculateResult = (e: MouseEvent) => {
        const delta = e.clientX - start;
        const valueRange = max() - min();
        const deltaValue = (delta / pixelRange) * valueRange
        const newValue = startValue + deltaValue;
        return clamp(Math.round(newValue / step()) * step(), min(), max());
    }

    const SliderClasses = createMemo(() => {
        const classes = [styles.Slider];

        if (ThumbSlot()) classes.push(styles['With-Thumb'])
        if (GridSlot()) classes.push(styles['With-Grid'])

        return classes.join(' ');
    });

    const calculateInitialValues = (e: MouseEvent) => {
        const { left, width } = trackElement.getBoundingClientRect();

        start = e.clientX;
        minValue = left
        maxValue = left + width;
        pixelRange = maxValue - minValue;
    }

    const changeValue = (newValue: number) => {
        const clampedValue = clamp(newValue, min(), max());

        setValue(clampedValue);
        props.onChange?.(clampedValue);
    }
 
    props.componentClasses = () => SliderClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            value,
            element,
            changeValue
        });
    });

    return (
        <SliderContext.Provider value={{ value, percent }}>
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
                    <SliderGrid min={min()} max={max()} parentChildren={props.children} />
            </div>
        </SliderContext.Provider>
    )
}

export default Object.assign(Slider, {Grid, Fill, Handle, Thumb, Track});