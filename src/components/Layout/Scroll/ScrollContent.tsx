
import { createMemo, JSX, onCleanup, onMount, ParentComponent, useContext } from 'solid-js';
import styles from './Scroll.module.scss';
import { createTokenComponent, TokenBase, useToken } from '@components/utils/tokenComponents';
import { forwardAttrs } from '@components/BaseComponent/BaseComponent';
import { TokenComponentProps } from '@components/types/ComponentProps';
import { ScrollContext } from './Scroll';

interface ScrollContentProps extends TokenComponentProps {
    ref: HTMLDivElement
}

interface ContentProps extends TokenBase {
    style?: JSX.CSSProperties | undefined
    class?: string
    ref?: HTMLDivElement
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
        const classes = [styles['content-wrapper']];
        if (scrollContext?.overflow()) classes.push(styles['content-wrapper-overflow']);
        if (ContentToken()?.class) classes.push(ContentToken()?.class as string);

        return classes.join(' ');
    });

    onMount(() => {
        resizeObserver = new ResizeObserver(scrollContext!.updateMeasurements);

        if (contentRef) resizeObserver.observe(contentRef);
    });

    const initContentRef = (el: HTMLDivElement) => {
        const token = ContentToken();
        token?.ref && (token.ref as any as (el: HTMLDivElement) => void)(el);
        (props.ref as any as (el: HTMLDivElement) => void)(el);
    }

    onCleanup(() => {
        if (resizeObserver) resizeObserver.disconnect();
    });

    return <div ref={initContentRef} style={contentStyles()} class={contentClasses()} use:forwardAttrs={ContentToken()}>
        <div ref={contentRef}>
            {ContentToken()?.children}
        </div>
    </div>
}
