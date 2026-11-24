import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './Slider.module.scss';
import { createMemo, ParentComponent } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { forwardAttrs } from '@components/BaseComponent/BaseComponent';

interface SliderTrackComponentProps extends TokenComponentProps {
    ref: HTMLDivElement | undefined,
    handleClick: (e: MouseEvent) => void,
}

export const Track = createTokenComponent();

export const SliderTrack: ParentComponent<SliderTrackComponentProps> = (props) => {
    const TrackToken = useToken(Track, props.parentChildren);

    const trackClasses = createMemo(() => {
        const classes = [styles.track];

        if (TrackToken?.()?.class) classes.push(TrackToken?.()?.class as string);

        return classes.join(' ');
    });

    return (
        <div ref={props.ref} class={trackClasses()} style={TrackToken?.()?.style} onMouseDown={props.handleClick} use:forwardAttrs={TrackToken()}>
            {props.children}
        </div>
    )
}