import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createSignal, onMount, ParentComponent, createMemo } from "solid-js";
import styles from './Slider.module.scss';
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { clamp } from "@components/utils/clamp";
import { Grid, SliderGrid } from "./SliderGrid";
import { Fill, SliderFill } from "./SliderFill";
import { Handle, SliderHandle } from "./SliderHandle";
import { SliderThumb, Thumb } from "./SliderThumb";
import { SliderTrack, Track } from "./SliderTrack";
import { useToken } from "@components/utils/tokenComponents";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";

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

const Slider: ParentComponent<SliderProps> = (props) => {
    const min = () => props.min || 0;
    const max = () => props.max || 100;
    const step = () => props.step || 1;
    const [value, setValue] = createSignal(clamp(props.value ?? 50, min(), max()));
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

        const result = snapToStep(Math.round(newValue / step()) * step())

        setValue(result);
        props.onChange?.(result);

        handleMouseDown(e);
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

        const result = calculateResult(e)
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

        return snapToStep(Math.round(newValue / step()) * step())
    }

    const snapToStep  = (value: number) => {
        return clamp(Number(value.toFixed(5)), min(), max());
    } 

    const SliderClasses = createMemo(() => {
        const classes = [styles.slider];

        if (ThumbSlot()) classes.push(styles['with-thumb'])
        if (GridSlot()) classes.push(styles['with-grid'])

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
    const { className, inlineStyles, forwardEvents, forwardAttrs, navigationActions } = useBaseComponent(props);

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            value,
            element,
            changeValue
        });
    });

    const defaultActions = {
        'move-left': () => changeValue(Number((value() - step()).toFixed(5))),
        'move-right': () => changeValue(Number((value() + step()).toFixed(5))),
    }

    return (
        <div
            ref={element!}
            class={className()}
            style={inlineStyles()}
            use:forwardEvents={props}
            use:forwardAttrs={props}
            use:navigationActions={mergeNavigationActions(props, defaultActions)}>
            <SliderTrack handleClick={handleTrackClick} ref={trackElement} parentChildren={props.children}>
                <SliderHandle percent={percent} handleMouseDown={handleMouseDown} parentChildren={props.children} />
                <SliderFill percent={percent} parentChildren={props.children} />
                <SliderThumb value={value} percent={percent} parentChildren={props.children} />
            </SliderTrack>
            <SliderGrid min={min()} max={max()} parentChildren={props.children} />
        </div>
    )
}

export default Object.assign(Slider, { Grid, Fill, Handle, Thumb, Track });