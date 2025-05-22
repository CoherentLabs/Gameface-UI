
import { createMemo, JSX, ParentComponent } from 'solid-js';
import styles from './Scroll.module.css';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { TokenComponentProps } from '@components/types/ComponentProps';

interface ScrollContentProps extends TokenComponentProps {
    ref: HTMLDivElement
}

interface ContentProps {
    style?: JSX.CSSProperties | undefined
    class?: string
}

export const Content = createTokenComponent<ContentProps>();

export const ScrollContent: ParentComponent<ScrollContentProps> = (props) => {
    const ContentToken = useToken(Content, props.parentChildren);

    const contentStyles = createMemo(() => {
        const token = ContentToken();
        if (token && token.style) return { ...token.style };

        return {};
    });

    const contentClasses = createMemo(() => {
        if (ContentToken()?.class) return styles.Content + ' ' + ContentToken()?.class;

        return styles.Content;
    });

    return <div ref={props.ref!} style={contentStyles()} class={contentClasses()}>
        {ContentToken()?.children}
    </div>
}
