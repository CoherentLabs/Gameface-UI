
import { createMemo, JSX, ParentComponent, useContext } from 'solid-js';
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
    const scrollContext = useContext(ScrollContext);
    const ContentToken = useToken(Content, props.parentChildren);

    const contentStyles = createMemo(() => {
        const token = ContentToken();
        if (token && token.style) return { ...token.style };

        return {};
    });

    const contentClasses = createMemo(() => {
        const classes = [styles.Content];
        if (scrollContext?.overflow()) classes.push(styles['Content-Overflow']);
        if (ContentToken()?.class) classes.push(ContentToken()?.class as string);

        return classes.join(' ');
    });

    return <div ref={props.ref!} style={contentStyles()} class={contentClasses()}>
        {ContentToken()?.children}
    </div>
}
