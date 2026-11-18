import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createSignal, ParentComponent, createContext, createEffect, untrack } from "solid-js";
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
import exposeRef from "@components/utils/exposeRef";
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

// `null` default: the grid reads it optionally (pattern 1.3.o).
export const TextSliderContext = createContext<TextSliderContext | null>(null);

const TextSlider: ParentComponent<TextSliderProps> = (props) => {
    const values = () => props.values || [];
    // Initial value only, as in 1.x.
    const initialValue = untrack(() => props.value || values()[0] || '');
    const [value, setValue] = createSignal(initialValue);
    // Always-current plain copy for the logic (Solid 2 stages signal writes).
    let current = initialValue;
    const writeValue = (newValue: string) => {
        current = newValue;
        setValue(newValue);
    };

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

    let trackElement!: HTMLDivElement;
    let sliding = false;
    let startValue: number;
    let geometry: TrackGeometry;

    const ThumbSlot = useToken(Thumb, () => props.children)

    // On change subscription (block body: an apply function's return value is its cleanup)
    createEffect(() => value(), (v) => { props.onChange?.(v); }, { defer: true });

    // Two Way Binding
    createEffect(() => props.value, (v) => {
        if (v !== undefined) changeValue(v);
    }, { defer: true });

    const handleTrackClick = (e: MouseEvent) => {
        geometry = getTrackGeometry(trackElement, e.clientX);

        const delta = geometry.start - geometry.trackStart;
        const result = Math.round(clamp(Math.round((delta / geometry.pixelRange) * 100), 0, 100));

        writeValue(findValueInPercent(result));
    }

    const handleMouseDown = (e: MouseEvent) => {
        stopImmediatePropagation(e);
        sliding = true;

        geometry = getTrackGeometry(trackElement, e.clientX);
        startValue = getValuePercent(current);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!sliding) return;

        const result = Math.round(calculateResult(e));
        writeValue(findValueInPercent(result));
    }

    const handleMouseUp = () => {
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

    const changeValue = (newValue: string) => {
        if (!values().includes(newValue)) {
            console.warn(`Value "${newValue}" is not in the list of allowed values.`);
            return;
        }
        writeValue(newValue);
    }

    const stepValue = (direction: 1 | -1) => {
        const currValues = values()
        const currentIndex = currValues.indexOf(current);
        const newIndex = clamp(currentIndex + direction, 0, currValues.length - 1);

        changeValue(currValues[newIndex]);
    }

    const defaultActions = {
        'move-left': () => { stepValue(-1); },
        'move-right': () => { stepValue(1); },
    }

    return (
        <TextSliderContext value={{ values }}>
            <div
                class={[styles.slider, styles['with-grid'], ThumbSlot() && styles['with-thumb'], props.class]}
                style={props.style}
                onFocusIn={() => setNavEngaged(true)}
                onFocusOut={() => setNavEngaged(false)}
                ref={[
                    exposeRef<Omit<TextSliderRef, 'element'>>(props, { value, values, changeValue, stepValue }),
                    baseComponent(props),
                    navigationActions(mergeNavigationActions(props, defaultActions)),
                ]}>
                <SliderTrack handleClick={handleTrackClick} ref={trackElement} parentChildren={props.children}>
                    <SliderHandle percent={percent} handleMouseDown={handleMouseDown} parentChildren={props.children} active={navEngaged} />
                    <SliderFill percent={percent} parentChildren={props.children} />
                    <SliderThumb value={value} percent={percent} parentChildren={props.children} />
                </SliderTrack>
                <TextSliderGrid parentChildren={props.children} />
            </div>
        </TextSliderContext>
    )
}

export default Object.assign(TextSlider, { Pol, Fill, Handle, Thumb, Track });
