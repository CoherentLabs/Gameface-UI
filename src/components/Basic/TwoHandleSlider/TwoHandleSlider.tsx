import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createSignal, onMount, ParentComponent, createMemo, onCleanup, createEffect, on } from "solid-js";
import styles from '@components/Basic/Slider/Slider.module.scss';
import { clamp } from "@components/utils/clamp";
import { useToken } from "@components/utils/tokenComponents";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";
import { SliderThumb, Thumb } from "../Slider/SliderThumb";
import { Grid, SliderGrid } from "../Slider/SliderGrid";
import { SliderTrack, Track } from "../Slider/SliderTrack";
import { Fill, SliderFill } from "./SliderFill";
import { stopImmediatePropagation } from "@components/utils/stopPropagation";
import { calculatePercent, getTrackGeometry, snapToStepAndNormalize, TrackGeometry } from "../Slider/sliderMath";
import { Handle, SliderHandle } from "../Slider/SliderHandle";

export type TwoHandleSliderValue = {
    start: number,
    end: number
}

export interface TwoHandleSliderRef {
    value: Accessor<TwoHandleSliderValue>,
    element: HTMLDivElement,
    changeValue: (newValue: TwoHandleSliderValue) => void
    changeStart: (start: number) => void
    changeEnd: (end: number) => void
    stepStart: (direction: 1 | -1) => void
    stepEnd: (direction: 1 | -1) => void
}

interface SliderProps extends ComponentProps {
    min?: number,
    max?: number,
    step?: number,
    value?: TwoHandleSliderValue,
    onChange?: (value: TwoHandleSliderValue) => void;
    onChangeEnd?: (value: TwoHandleSliderValue) => void;
}

const TwoHandleSlider: ParentComponent<SliderProps> = (props) => {
    const min = () => props.min ?? 0;
    const max = () => props.max ?? 100;
    const step = () => props.step ?? 1;
    const [startValue, setStartValue] = createSignal(clamp(props.value?.start ?? min(), min(), max()));
    const [endValue, setEndValue] = createSignal(clamp(props.value?.end ?? max(), startValue() + step(), max()));
    const [activeHandle, setActiveHandle] = createSignal<'start' | 'end'>('start');
    // purely for navigation state
    const [navEngaged, setNavEngaged] = createSignal(false);

    const startPercent = () => calculatePercent(startValue(), min(), max());
    const endPercent = () => calculatePercent(endValue(), min(), max());
    const middlePercent = () => endPercent() - startPercent();

    let element!: HTMLDivElement;
    let trackElement!: HTMLDivElement;
    let sliding = false;
    let commitTimeout: ReturnType<typeof setTimeout> | undefined;
    
    let geometry: TrackGeometry;
    let currentStartValue: number,
        currentEndValue: number;

    const ThumbSlot = useToken(Thumb, props.children)
    const GridSlot = useToken(Grid, props.children)

    createEffect(on([startValue, endValue], ([start, end]) => props.onChange?.({ start, end }), { defer: true }));
    // Two Way Binding
    createEffect(on(() => props.value, (newValue) => {
        if (newValue) changeValue(newValue);
    }, {defer: true}));

    const handleTrackClick = (e: MouseEvent) => {
        geometry = getTrackGeometry(trackElement, e.clientX);

        const valueRange = max() - min();
        const delta = geometry.start - geometry.trackStart;
        const newValue = min() + (delta / geometry.pixelRange) * valueRange;
        const result = snapValue(newValue);

        const isStartHandle = Math.abs(newValue - startValue()) < Math.abs(newValue - endValue());

        if (isStartHandle) {
            setStartValue(clampStartValue(result));
            beginActiveDrag('start');
        } else {
            setEndValue(clampEndValue(result));
            beginActiveDrag('end');
        }
    }

    // just attaches the drag, assumes geometry is already calculated
    const beginActiveDrag = (handle: 'start' | 'end') => {
        setActiveHandle(handle);
        if (handle === 'start') currentStartValue = startValue();
        else currentEndValue = endValue();

        sliding = true;
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDownStartHandle = (e: MouseEvent) => {
        stopImmediatePropagation(e);
        geometry = getTrackGeometry(trackElement, e.clientX);
        beginActiveDrag('start');
    };

    const handleMouseDownEndHandle = (e: MouseEvent) => {
        stopImmediatePropagation(e);
        geometry = getTrackGeometry(trackElement, e.clientX);
        beginActiveDrag('end');
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!sliding) return;

        const currHandle = activeHandle();
        const base = currHandle === 'start' ? currentStartValue : currentEndValue;

        const result = calculateResult(e, base)

        if (currHandle === 'start') {
            setStartValue(clampStartValue(result));
        } else {
            setEndValue(clampEndValue(result));
        }
    }

    const handleMouseUp = () => {
        if (!sliding) return;

        sliding = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        props.onChangeEnd?.({ start: startValue(), end: endValue() });
    }

    const calculateResult = (e: MouseEvent, base: number) => {
        const valueRange = max() - min();
        const delta = e.clientX - geometry.start;
        const deltaValue = (delta / geometry.pixelRange) * valueRange;
        const newValue = base + deltaValue;

        return snapValue(newValue);
    }

    const snapValue = (value: number) => snapToStepAndNormalize(value, step(), min(), max());

    const clampStartValue = (newValue: number) => {
        return Math.min(newValue, endValue() - step());   // keep a one-step gap below end
    }

    const clampEndValue = (newValue: number) => {
        return Math.max(newValue, startValue() + step());    // keep a one-step gap above start
    }

    const SliderClasses = createMemo(() => {
        const classes = [styles.slider];

        if (ThumbSlot()) classes.push(styles['with-thumb'])
        if (GridSlot()) classes.push(styles['with-grid'])

        return classes.join(' ');
    });

    /** Sets both handles at once, snapping each to step and keeping them from crossing. */
    const changeValue = (newValue: TwoHandleSliderValue) => {
        const start = Math.min(newValue.start, newValue.end - step());
        const end = Math.max(newValue.end, newValue.start + step());

        setStartValue(snapValue(start));
        setEndValue(snapValue(end));
    }

    /** Sets the start handle, snapped to step and capped one step below the end handle. */
    const changeStart = (newStart: number) => {
        const clampedStart = clampStartValue(newStart);
        setStartValue(snapValue(clampedStart));
    }

    /** Sets the end handle, snapped to step and floored one step above the start handle. */
    const changeEnd = (newEnd: number) => {
        const clampedEnd = clampEndValue(newEnd);
        setEndValue(snapValue(clampedEnd));
    }

    /** Nudges the start handle by one step in the given direction (1 = up, -1 = down). */
    const stepStart = (direction: 1 | -1) => {
        changeStart(startValue() + step() * direction);
    }

    /** Nudges the end handle by one step in the given direction (1 = up, -1 = down). */
    const stepEnd = (direction: 1 | -1) => {
        changeEnd(endValue() + step() * direction);
    }

    // gamepad movement has no release event so we debounce a synthetic commit
    // Remove when 'release' event is supported with IM gamepad
    const scheduleCommit = () => {
        if (!props.onChangeEnd) return;

        if (commitTimeout) clearTimeout(commitTimeout);
        commitTimeout = setTimeout(() => {
            commitTimeout = undefined;
            props.onChangeEnd?.({ start: startValue(), end: endValue() });
        }, 250);
    }

    const stepActive = (direction: 1 | -1) => {
        if (activeHandle() === 'start') {
            stepStart(direction);
        } else {
            stepEnd(direction);
        }
        scheduleCommit();
    }

    props.componentClasses = () => SliderClasses();

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as (ref: TwoHandleSliderRef) => void)({
            element,
            value: () => ({ start: startValue(), end: endValue() }),
            changeValue,
            changeStart,
            changeEnd,
            stepStart,
            stepEnd
        });
    });

    onCleanup(() => {
        handleMouseUp();
        if (commitTimeout) clearTimeout(commitTimeout);
        if(sliding) {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    })

    const defaultActions = {
        'move-left':  () => { stepActive(-1); },
        'move-right': () => { stepActive(+1); },
        'select':     () => setActiveHandle(h => h === 'start' ? 'end' : 'start'),
    }

    return (
        <div
            ref={element!}
            on:focusin={() => setNavEngaged(true)}
            on:focusout={() => setNavEngaged(false)}
            use:baseComponent={props}
            use:navigationActions={mergeNavigationActions(props, defaultActions)}>
            <SliderTrack handleClick={handleTrackClick} ref={trackElement} parentChildren={props.children}>
                {/* Left */}
                <SliderHandle 
                    percent={startPercent} 
                    handleMouseDown={handleMouseDownStartHandle} 
                    parentChildren={props.children} 
                    active={() => activeHandle() === 'start' && navEngaged()} 
                    dragged={() => activeHandle() === 'start'} />
                <SliderThumb value={startValue} percent={startPercent} parentChildren={props.children} />
                {/* Right */}
                <SliderHandle 
                    percent={endPercent} 
                    handleMouseDown={handleMouseDownEndHandle} 
                    parentChildren={props.children} 
                    active={() => activeHandle() === 'end' && navEngaged()}
                    dragged={() => activeHandle() === 'end'} />
                <SliderThumb value={endValue} percent={endPercent} parentChildren={props.children} />
                <SliderFill
                    percent={middlePercent}
                    offset={startPercent}
                    parentChildren={props.children} />
            </SliderTrack>
            <SliderGrid min={min()} max={max()} parentChildren={props.children} />
        </div>
    )
}

export default Object.assign(TwoHandleSlider, { Grid, Fill, Handle, Thumb, Track });
