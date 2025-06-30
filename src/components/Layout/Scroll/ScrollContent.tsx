
import { createMemo, JSX, onCleanup, onMount, ParentComponent, useContext } from 'solid-js';
import styles from './Scroll.module.css';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { TokenComponentProps } from '@components/types/ComponentProps';
import { ScrollContext } from './Scroll';

interface ScrollContentProps extends TokenComponentProps {
    ref: HTMLDivElement
}

interface ContentProps {
    style?: JSX.CSSProperties | undefined
    class?: string
}

export const Content = createTokenComponent<ContentProps>();

export const ScrollContent: ParentComponent<ScrollContentProps> = (props) => {
    let resizeObserver: ResizeObserver;
    let contentRef: HTMLDivElement | undefined;

    const scrollContext = useContext(ScrollContext);
    const ContentToken = useToken(Content, props.parentChildren);

    const contentStyles = createMemo(() => {
        const token = ContentToken();
        if (token && token.style) return { ...token.style };

        return {};
    });

    const contentClasses = createMemo(() => {
        const classes = [styles['Content-Wrapper']];
        if (scrollContext?.overflow()) classes.push(styles['Content-Wrapper-Overflow']);
        if (ContentToken()?.class) classes.push(ContentToken()?.class as string);

        return classes.join(' ');
    });

    onMount(() => {
        resizeObserver = new ResizeObserver(scrollContext!.updateMeasurements);

        if (contentRef!) resizeObserver.observe(contentRef);
    });

    onCleanup(() => {
        if (resizeObserver) resizeObserver.disconnect();
    });

    return <div ref={props.ref!} style={contentStyles()} class={contentClasses()}>
        <div ref={contentRef!}>
            {ContentToken()?.children}
        </div>
    </div>
}
