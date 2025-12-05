import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createSignal, onMount, ParentComponent, createContext, createMemo } from "solid-js";
import styles from '@components/Basic/Slider/Slider.module.scss';
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { clamp } from "@components/utils/clamp";
import { TextSliderGrid } from "./TextSliderGrid";
import { Fill, SliderFill } from "@components/Basic/Slider/SliderFill";
import { Handle, SliderHandle } from "@components/Basic/Slider/SliderHandle";
import { SliderThumb, Thumb } from "@components/Basic/Slider/SliderThumb";
import { SliderTrack, Track } from "@components/Basic/Slider/SliderTrack";
import { useToken } from "@components/utils/tokenComponents";
import { Pol } from "./TextSliderPol";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";

export interface TextSliderRef {
    value: Accessor<string>,
    values: Accessor<string[]>
    element: HTMLDivElement,
    changeValue: (newValue: string) => void,
    stepValue: (direction: 1 | -1) => void
}

interface TextSliderProps extends ComponentProps {
    value?: string,
    values: string[],
    onChange?: (value: string) => void;
}

interface TextSliderContext {
    values: Accessor<string[]>,
}

export const TextSliderContext = createContext<TextSliderContext>();

const TextSlider: ParentComponent<TextSliderProps> = (props) => {
    const values = () => props.values || [];
    const [value, setValue] = createSignal(props.value || values()[0] || '');
    const getValuePercent = (value: string) => {
        const valueIndex = values().indexOf(value);
        if (valueIndex === -1) return 0;

        return valueIndex / (values().length - 1) * 100;
    }

    const findValueInPercent = (percent: number) => {
        const index = Math.round((percent / 100) * (values().length - 1));
        return values()[index] || '';
    }

    const percent = () => getValuePercent(value());

    let element!: HTMLDivElement;
    let trackElement!: HTMLDivElement;
    let sliding = false;
    let start: number,
        maxValue: number,
        minValue: number,
        pixelRange: number,
        startValue: number;

    const ThumbSlot = useToken(Thumb, props.children)

    const handleTrackClick = (e: MouseEvent) => {
        calculateInitialValues(e);
        const delta = start - minValue;
        const result = Math.round(clamp(Math.round((delta / pixelRange) * 100), 0, 100));
        const newValue = findValueInPercent(result)

        setValue(newValue);
        props.onChange?.(newValue);
    }

    const handleMouseDown = (e: MouseEvent) => {
        e.stopImmediatePropagation();
        sliding = true;

        calculateInitialValues(e);
        startValue = getValuePercent(value());

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!sliding) return;

        const result = Math.round(calculateResult(e));
        const newValue = findValueInPercent(result)

        setValue(newValue);
        props.onChange?.(newValue);
    }

    const handleMouseUp = (e: MouseEvent) => {
        if (!sliding) return;

        sliding = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }

    const calculateResult = (e: MouseEvent) => {
        const delta = e.clientX - start;
        const deltaValue = (delta / pixelRange) * 100;
        const newValue = startValue + deltaValue;
        return clamp(Math.round(newValue), 0, 100);
    }

    const SliderClasses = createMemo(() => {
        const classes = [styles.slider, styles['with-grid']];

        if (ThumbSlot()) classes.push(styles['with-thumb'])

        return classes.join(' ');
    });

    const calculateInitialValues = (e: MouseEvent) => {
        const { left, width } = trackElement.getBoundingClientRect();

        start = e.clientX;
        minValue = left;
        maxValue = left + width;
        pixelRange = maxValue - minValue;
    }

    const changeValue = (newValue: string) => {
        if (!values().includes(newValue)) {
            console.warn(`Value "${newValue}" is not in the list of allowed values.`);
            return;
        }
        setValue(newValue);
        props.onChange?.(newValue);
    }

    const stepValue = (direction: 1 | -1) => {
        const currValues = values()
        const currentIndex = currValues.indexOf(value());
        const newIndex = clamp(currentIndex + direction, 0, currValues.length - 1);

        changeValue(currValues[newIndex]);
    }

    props.componentClasses = () => SliderClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs, navigationActions } = useBaseComponent(props);

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            value,
            values,
            element,
            changeValue,
            stepValue
        });
    });

    
    const defaultActions = {
        'move-left': () => stepValue(-1),
        'move-right': () => stepValue(1),
    }

    return (
        <TextSliderContext.Provider value={{ values }}>
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
                <TextSliderGrid parentChildren={props.children} />
            </div>
        </TextSliderContext.Provider>
    )
}

export default Object.assign(TextSlider, { Pol, Fill, Handle, Thumb, Track });
