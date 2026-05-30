
import { createMemo, onCleanup, onSettled, ParentComponent, useContext } from 'solid-js';
import styles from './Scroll.module.scss';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { TokenComponentProps } from '@components/types/ComponentProps';
import { ScrollContext } from './Scroll';
import { JSX, untrack } from '@solidjs/web';

interface ScrollContentProps extends TokenComponentProps {
    ref: HTMLDivElement
}

interface ContentProps {
    style?: JSX.CSSProperties | undefined
    class?: string
    ref?: HTMLDivElement
}

export const Content = createTokenComponent<ContentProps>();

export const ScrollContent: ParentComponent<ScrollContentProps> = (props) => {
    let resizeObserver: ResizeObserver;
    let contentRef: HTMLDivElement | undefined;

    const scrollContext = useContext(ScrollContext);
    const ContentToken = useToken(Content, () => props.parentChildren);

    const contentStyles = createMemo(() => {
        const token = ContentToken();
        if (token && token.style) return { ...token.style };

        return {};
    });

    const contentClasses = createMemo(() => {
        const classes = [styles['content-wrapper']];
        if (scrollContext?.overflow()) classes.push(styles['content-wrapper-overflow']);
        if (ContentToken()?.class) classes.push(ContentToken()?.class as string);

        return classes.join(' ');
    });

    onSettled(() => {
        resizeObserver = new ResizeObserver(scrollContext!.updateMeasurements);

        if (contentRef) resizeObserver.observe(contentRef);
    });

    const initContentRef = () => {
        const token = untrack(() => ContentToken());

        return (el: HTMLDivElement) => {
            token?.ref && (token.ref as any as (el: HTMLDivElement) => void)(el);
            (props.ref as any as (el: HTMLDivElement) => void)(el);
        }
    }

    onCleanup(() => {
        if (resizeObserver) resizeObserver.disconnect();
    });

    return <div ref={initContentRef()} style={contentStyles()} class={contentClasses()}>
        <div ref={contentRef}>
            {ContentToken()?.children}
        </div>
    </div>
}
