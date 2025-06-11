import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, Setter, createSignal, onMount, ParentComponent, Show, createContext, createMemo, createEffect, For } from "solid-js";
import styles from './Slider.module.css';
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { clamp } from "@components/utils/clamp";
import { Grid, SliderGrid } from "./SliderGrid";

export interface SliderRef {
    element: HTMLDivElement,
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
}

export const SliderContext = createContext<SliderContext>();

const Slider: ParentComponent<SliderProps> = (props) => {
    const [value, setValue] = createSignal(clamp(props.value, props.min, props.max));
    const [sliding, setSliding] = createSignal(false);
    const percent = () => ((value() - props.min) / (props.max - props.min)) * 100;
    let element!: HTMLDivElement;
    let trackElement!: HTMLDivElement;
    let fillElement!: HTMLDivElement;
    let startX: number,
        maxValue: number,
        minValue: number,
        range: number,
        startValue: number;
    let hasDragged = false;

    const handleTrackClick = (e: MouseEvent) => {
        if (hasDragged) {
            hasDragged = false;
            return;
        }

        calculateInitialValues(e);
        const dx = startX - minValue;
        const newValue = props.min + (dx / range) * (props.max - props.min);
        const result = clamp(Math.round(newValue / props.step) * props.step, props.min, props.max);

        setValue(result)
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
        
        const dx = e.clientX - startX;
        const deltaValue = (dx / range) * (props.max - props.min);
        const newValue = startValue + deltaValue;
        const result = clamp(Math.round(newValue / props.step) * props.step, props.min, props.max);

        setValue(Math.round(result));
    }
    
    const handleMouseUp = (e: MouseEvent) => {
        if (!sliding()) return;
        
        hasDragged = true;
        setSliding(false);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }

    const SliderClasses = createMemo(() => {
        const classes = [styles.Slider];

        return classes.join(' ');
    });

    const calculateInitialValues = (e: MouseEvent) => {
        const { left, width } = trackElement.getBoundingClientRect();

        startX = e.clientX;
        minValue = left
        maxValue = left + width;
        range = maxValue - minValue;
    }
 
    props.componentClasses = () => SliderClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            value: props.value,
            element,
        });
    });

    return (
        <SliderContext.Provider value={{ value }}>
            <div
                ref={element!}
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props}
                use:forwardAttrs={props}>
                    <div ref={trackElement} class={styles.Track} onClick={handleTrackClick}>
                        <div ref={fillElement} class={styles.Fill} style={{ width: `${percent()}%` }}>
                            <div class={styles.Handle} onMouseDown={handleMouseDown}></div>
                            <div class={styles.Thumb}>{value()}</div>
                        </div>
                        <SliderGrid min={props.min} max={props.max} parentChildren={props.children} />
                    </div>
            </div>
        </SliderContext.Provider>
    )
}

export default Object.assign(Slider, {Grid});