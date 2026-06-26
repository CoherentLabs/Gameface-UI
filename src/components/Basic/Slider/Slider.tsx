import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createSignal, onMount, ParentComponent, createMemo, onCleanup, createEffect, on } from "solid-js";
import styles from './Slider.module.scss';
import { clamp } from "@components/utils/clamp";
import { Grid, SliderGrid } from "./SliderGrid";
import { Fill, SliderFill } from "./SliderFill";
import { Handle, SliderHandle } from "./SliderHandle";
import { SliderThumb, Thumb } from "./SliderThumb";
import { SliderTrack, Track } from "./SliderTrack";
import { useToken } from "@components/utils/tokenComponents";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";
import { calculatePercent, getTrackGeometry, snapToStepAndNormalize, TrackGeometry } from "./sliderMath";
import { stopImmediatePropagation } from "@components/utils/stopPropagation";

export interface SliderRef {
    value: Accessor<number>,
    element: HTMLDivElement,
    changeValue: (newValue: number) => void,
    stepValue: (direction: 1 | -1) => void
}

interface SliderProps extends ComponentProps {
    value?: number,
    min?: number,
    max?: number,
    step?: number,
    onChange?: (value: number) => void;
    onChangeEnd?: (value: number) => void;
}

const Slider: ParentComponent<SliderProps> = (props) => {
    const min = () => props.min || 0;
    const max = () => props.max || 100;
    const step = () => props.step || 1;
    const [value, setValue] = createSignal(clamp(props.value ?? 50, min(), max()));
    // purely for navigation state
    const [navEngaged, setNavEngaged] = createSignal(false);
    const percent = () => calculatePercent(value(), min(), max());

    let element!: HTMLDivElement;
    let trackElement!: HTMLDivElement;
    let sliding = false;
    let commitTimeout: ReturnType<typeof setTimeout> | undefined;
    let startValue: number;
    let geometry: TrackGeometry;

    const ThumbSlot = useToken(Thumb, props.children)
    const GridSlot = useToken(Grid, props.children)

    // On change subscription
    createEffect(on(value, (v) => props.onChange?.(v), { defer: true }));

    // Two Way Binding
    createEffect(on(() => props.value, (v) => {
        if (v !== undefined) changeValue(v);
    }, { defer: true }));

    const handleTrackClick = (e: MouseEvent) => {
        geometry = getTrackGeometry(trackElement, e.clientX);
        
        const valueRange = max() - min();
        const delta = geometry.start - geometry.trackStart;
        const newValue = min() + (delta / geometry.pixelRange) * valueRange;

        const result = snapValue(newValue)

        setValue(result);
        handleMouseDown(e);
    }

    const handleMouseDown = (e: MouseEvent) => {
        stopImmediatePropagation(e);
        sliding = true;

        geometry = getTrackGeometry(trackElement, e.clientX);
        startValue = value();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!sliding) return;

        const result = calculateResult(e)
        setValue(result);
    }

    const handleMouseUp = () => {
        if (!sliding) return;

        sliding = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        props.onChangeEnd?.(value());
    }

    const calculateResult = (e: MouseEvent) => {
        const delta = e.clientX - geometry.start;
        const valueRange = max() - min();
        const deltaValue = (delta / geometry.pixelRange) * valueRange
        const newValue = startValue + deltaValue;

        return snapValue(newValue);
    }

    const snapValue = (value: number) => snapToStepAndNormalize(value, step(), min(), max());

    const SliderClasses = createMemo(() => {
        const classes = [styles.slider];

        if (ThumbSlot()) classes.push(styles['with-thumb'])
        if (GridSlot()) classes.push(styles['with-grid'])

        return classes.join(' ');
    });

    const changeValue = (newValue: number) => {
        setValue(snapValue(newValue));
    }

    const stepValue = (direction: 1 | -1) => {
        changeValue(value() + step() * direction);
    }

    // gamepad movement has no release event so we debounce a synthetic commit
    // Remove when 'release' event is supported with IM gamepad
    const scheduleCommit = () => {
        if (!props.onChangeEnd) return;

        if (commitTimeout) clearTimeout(commitTimeout);
        commitTimeout = setTimeout(() => {
            commitTimeout = undefined;
            props.onChangeEnd?.(value());
        }, 250);
    }

    props.componentClasses = () => SliderClasses();

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: SliderRef) => void)({
            value,
            element,
            changeValue,
            stepValue
        });
    });

    onCleanup(() => {
        handleMouseUp();
        if (commitTimeout) clearTimeout(commitTimeout);
    })

    const defaultActions = {
        'move-left': () => { stepValue(-1); scheduleCommit(); },
        'move-right': () => { stepValue(1); scheduleCommit(); },
    }

    return (
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
            <SliderGrid min={min()} max={max()} parentChildren={props.children} />
        </div>
    )
}

export default Object.assign(Slider, { Grid, Fill, Handle, Thumb, Track });