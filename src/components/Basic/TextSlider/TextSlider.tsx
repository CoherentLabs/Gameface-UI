import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createSignal, onMount, ParentComponent, createContext, createMemo, createEffect, on } from "solid-js";
import styles from '@components/Basic/Slider/Slider.module.scss';
import { clamp } from "@components/utils/clamp";
import { TextSliderGrid } from "./TextSliderGrid";
import { Fill, SliderFill } from "@components/Basic/Slider/SliderFill";
import { Handle, SliderHandle } from "@components/Basic/Slider/SliderHandle";
import { SliderThumb, Thumb } from "@components/Basic/Slider/SliderThumb";
import { SliderTrack, Track } from "@components/Basic/Slider/SliderTrack";
import { useToken } from "@components/utils/tokenComponents";
import { Pol } from "./TextSliderPol";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";
import { getTrackGeometry, TrackGeometry } from "../Slider/sliderMath";
import { stopImmediatePropagation } from "@components/utils/stopPropagation";

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
    // purely for navigation state
    const [navEngaged, setNavEngaged] = createSignal(false);
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
    let startValue: number;
    let geometry: TrackGeometry;

    const ThumbSlot = useToken(Thumb, props.children)

    // On change subscription
    createEffect(on(value, (v) => props.onChange?.(v), { defer: true }));

    // Two Way Binding
    createEffect(on(() => props.value, (v) => {
        if (v !== undefined) changeValue(v);
    }, { defer: true }));

    const handleTrackClick = (e: MouseEvent) => {
        geometry = getTrackGeometry(trackElement, e.clientX);

        const delta = geometry.start - geometry.trackStart;
        const result = Math.round(clamp(Math.round((delta / geometry.pixelRange) * 100), 0, 100));
        const newValue = findValueInPercent(result)

        setValue(newValue);
    }

    const handleMouseDown = (e: MouseEvent) => {
        stopImmediatePropagation(e);
        sliding = true;

        geometry = getTrackGeometry(trackElement, e.clientX);
        startValue = getValuePercent(value());

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!sliding) return;

        const result = Math.round(calculateResult(e));
        const newValue = findValueInPercent(result)

        setValue(newValue);
    }

    const handleMouseUp = (e: MouseEvent) => {
        if (!sliding) return;

        sliding = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }

    const calculateResult = (e: MouseEvent) => {
        const delta = e.clientX - geometry.start;
        const deltaValue = (delta / geometry.pixelRange) * 100;
        const newValue = startValue + deltaValue;
        return clamp(Math.round(newValue), 0, 100);
    }

    const SliderClasses = createMemo(() => {
        const classes = [styles.slider, styles['with-grid']];

        if (ThumbSlot()) classes.push(styles['with-thumb'])

        return classes.join(' ');
    });

    const changeValue = (newValue: string) => {
        if (!values().includes(newValue)) {
            console.warn(`Value "${newValue}" is not in the list of allowed values.`);
            return;
        }
        setValue(newValue);
    }

    const stepValue = (direction: 1 | -1) => {
        const currValues = values()
        const currentIndex = currValues.indexOf(value());
        const newIndex = clamp(currentIndex + direction, 0, currValues.length - 1);

        changeValue(currValues[newIndex]);
    }

    props.componentClasses = () => SliderClasses();

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
                on:focusin={() => setNavEngaged(true)}
                on:focusout={() => setNavEngaged(false)}
                use:baseComponent={props}
                use:navigationActions={mergeNavigationActions(props, defaultActions)}>
                <SliderTrack handleClick={handleTrackClick} ref={trackElement} parentChildren={props.children}>
                    <SliderHandle percent={percent} handleMouseDown={handleMouseDown} parentChildren={props.children} active={navEngaged} />
                    <SliderFill percent={percent} parentChildren={props.children} />
                    <SliderThumb value={value} percent={percent} parentChildren={props.children} />
                </SliderTrack>
                <TextSliderGrid parentChildren={props.children} />
            </div>
        </TextSliderContext.Provider>
    )
}

export default Object.assign(TextSlider, { Pol, Fill, Handle, Thumb, Track });
