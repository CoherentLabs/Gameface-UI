import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './Slider.module.css';
import { createMemo, JSX, ParentComponent } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';

interface SliderTrackProps {
    style?: JSX.CSSProperties,
    class?: string,
}

interface SliderTrackComponentProps extends TokenComponentProps {
    ref: HTMLDivElement | undefined,
    handleClick: (e: MouseEvent) => void,
}

export const Track = createTokenComponent<SliderTrackProps>();

export const SliderTrack: ParentComponent<SliderTrackComponentProps> = (props) => {
    const TrackToken = useToken(Track, props.parentChildren);

    const trackClasses = createMemo(() => {
        const classes = [styles.Track];

        if (TrackToken?.()?.class) classes.push(TrackToken?.()?.class as string);

        return classes.join(' ');
    });

    return (
        <div ref={props.ref} class={trackClasses()} style={TrackToken?.()?.style} onMouseDown={props.handleClick}>
            {props.children}
        </div>
    )
}