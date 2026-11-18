
import { createMemo, onCleanup, onSettled, ParentComponent, untrack, useContext } from 'solid-js';
import { JSX } from '@solidjs/web';
import styles from './Scroll.module.scss';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { TokenComponentProps } from '@components/types/ComponentProps';
import { ScrollContext } from './Scroll';

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

    const contentClasses = () => [
        styles['content-wrapper'],
        scrollContext?.overflow() && styles['content-wrapper-overflow'],
        ContentToken()?.class,
    ];

    onSettled(() => {
        resizeObserver = new ResizeObserver(scrollContext!.updateMeasurements);

        if (contentRef) resizeObserver.observe(contentRef);
    });

    // Ref callbacks run once: read the token and the ref prop untracked (intentional one-time read).
    const initContentRef = (el: HTMLDivElement) => untrack(() => {
        const token = ContentToken();
        token?.ref && (token.ref as any as (el: HTMLDivElement) => void)(el);
        (props.ref as any as (el: HTMLDivElement) => void)(el);
    });

    onCleanup(() => {
        if (resizeObserver) resizeObserver.disconnect();
    });

    return <div ref={initContentRef} style={contentStyles()} class={contentClasses()}>
        <div ref={contentRef}>
            {ContentToken()?.children}
        </div>
    </div>
}
