import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createSignal, ParentComponent, onCleanup, createEffect, untrack } from "solid-js";
import styles from '@components/Basic/Slider/Slider.module.scss';
import { clamp } from "@components/utils/clamp";
import { useToken } from "@components/utils/tokenComponents";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";
import exposeRef from "@components/utils/exposeRef";
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

    // Initial values only, as in 1.x (later changes go through the two-way binding below).
    const initialStart = untrack(() => clamp(props.value?.start ?? min(), min(), max()));
    const initialEnd = untrack(() => clamp(props.value?.end ?? max(), initialStart + step(), max()));
    const [startValue, setStartValue] = createSignal(initialStart);
    const [endValue, setEndValue] = createSignal(initialEnd);
    // Solid 2 stages writes (a read right after a set returns the old value until
    // the next microtask). The clamping/drag logic reads one handle right after
    // writing the other, so it uses these always-current plain copies; the
    // signals drive rendering.
    let curStart = initialStart;
    let curEnd = initialEnd;
    const writeValues = (start: number, end: number) => {
        if (start === curStart && end === curEnd) return;
        curStart = start;
        curEnd = end;
        setStartValue(start);
        setEndValue(end);
        props.onChange?.({ start, end });
    };
    const writeStart = (value: number) => writeValues(value, curEnd);
    const writeEnd = (value: number) => writeValues(curStart, value);

    const [activeHandle, setActiveHandle] = createSignal<'start' | 'end'>('start');
    // purely for navigation state
    const [navEngaged, setNavEngaged] = createSignal(false);

    const startPercent = () => calculatePercent(startValue(), min(), max());
    const endPercent = () => calculatePercent(endValue(), min(), max());
    const middlePercent = () => endPercent() - startPercent();

    let trackElement!: HTMLDivElement;
    let sliding = false;
    let commitTimeout: ReturnType<typeof setTimeout> | undefined;

    let geometry: TrackGeometry;
    let currentStartValue: number,
        currentEndValue: number;

    const ThumbSlot = useToken(Thumb, () => props.children)
    const GridSlot = useToken(Grid, () => props.children)

    // Two Way Binding
    createEffect(() => props.value, (newValue) => {
        if (newValue) changeValue(newValue);
    }, { defer: true });

    const handleTrackClick = (e: MouseEvent) => {
        geometry = getTrackGeometry(trackElement, e.clientX);

        const valueRange = max() - min();
        const delta = geometry.start - geometry.trackStart;
        const newValue = min() + (delta / geometry.pixelRange) * valueRange;
        const result = snapValue(newValue);

        const isStartHandle = Math.abs(newValue - curStart) < Math.abs(newValue - curEnd);

        if (isStartHandle) {
            writeStart(clampStartValue(result));
            beginActiveDrag('start');
        } else {
            writeEnd(clampEndValue(result));
            beginActiveDrag('end');
        }
    }

    // just attaches the drag, assumes geometry is already calculated
    const beginActiveDrag = (handle: 'start' | 'end') => {
        setActiveHandle(handle);
        if (handle === 'start') currentStartValue = curStart;
        else currentEndValue = curEnd;

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
            writeStart(clampStartValue(result));
        } else {
            writeEnd(clampEndValue(result));
        }
    }

    const handleMouseUp = () => {
        if (!sliding) return;

        sliding = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        props.onChangeEnd?.({ start: curStart, end: curEnd });
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
        return Math.min(newValue, curEnd - step());   // keep a one-step gap below end
    }

    const clampEndValue = (newValue: number) => {
        return Math.max(newValue, curStart + step());    // keep a one-step gap above start
    }

    /** Sets both handles at once, snapping each to step and keeping them from crossing. */
    const changeValue = (newValue: TwoHandleSliderValue) => {
        const start = Math.min(newValue.start, newValue.end - step());
        const end = Math.max(newValue.end, newValue.start + step());

        writeValues(snapValue(start), snapValue(end));
    }

    /** Sets the start handle, snapped to step and capped one step below the end handle. */
    const changeStart = (newStart: number) => {
        const clampedStart = clampStartValue(newStart);
        writeStart(snapValue(clampedStart));
    }

    /** Sets the end handle, snapped to step and floored one step above the start handle. */
    const changeEnd = (newEnd: number) => {
        const clampedEnd = clampEndValue(newEnd);
        writeEnd(snapValue(clampedEnd));
    }

    /** Nudges the start handle by one step in the given direction (1 = up, -1 = down). */
    const stepStart = (direction: 1 | -1) => {
        changeStart(curStart + step() * direction);
    }

    /** Nudges the end handle by one step in the given direction (1 = up, -1 = down). */
    const stepEnd = (direction: 1 | -1) => {
        changeEnd(curEnd + step() * direction);
    }

    // gamepad movement has no release event so we debounce a synthetic commit
    // Remove when 'release' event is supported with IM gamepad
    const scheduleCommit = () => {
        if (!props.onChangeEnd) return;

        if (commitTimeout) clearTimeout(commitTimeout);
        commitTimeout = setTimeout(() => {
            commitTimeout = undefined;
            props.onChangeEnd?.({ start: curStart, end: curEnd });
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
        'select':     () => { setActiveHandle(h => h === 'start' ? 'end' : 'start'); },
    }

    return (
        <div
            class={[styles.slider, ThumbSlot() && styles['with-thumb'], GridSlot() && styles['with-grid'], props.class]}
            style={props.style}
            onFocusIn={() => setNavEngaged(true)}
            onFocusOut={() => setNavEngaged(false)}
            ref={[
                exposeRef<Omit<TwoHandleSliderRef, 'element'>>(props, {
                    value: () => ({ start: startValue(), end: endValue() }),
                    changeValue,
                    changeStart,
                    changeEnd,
                    stepStart,
                    stepEnd
                }),
                baseComponent(props),
                navigationActions(mergeNavigationActions(props, defaultActions)),
            ]}>
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
