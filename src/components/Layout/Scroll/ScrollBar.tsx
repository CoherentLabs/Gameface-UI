import { createMemo, JSX, ParentComponent, Show, useContext } from 'solid-js';
import { ScrollContext } from './Scroll';
import styles from './Scroll.module.css';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { ScrollHandle } from './ScrollHandle';
import { TokenComponentProps } from '@components/types/ComponentProps';

export interface BarTokenProps {
    style?: JSX.CSSProperties | undefined
    class?: string
}

export const Bar = createTokenComponent<BarTokenProps>();

export const ScrollBar: ParentComponent<TokenComponentProps> = (props) => {
    const scrollContext = useContext(ScrollContext);
    const BarToken = useToken(Bar, props.parentChildren);

    const scrollBarStyles = createMemo(() => {
        const token = BarToken();
        if (token && token.style) return { ...token.style };
    });

    const scrollBarClasses = createMemo(() => {
        if (BarToken()?.class) return styles.ScrollBar + ' ' + BarToken()?.class;

        return styles.ScrollBar;
    });

    return (
        <Show when={scrollContext?.overflow()}>
            <div
                class={scrollBarClasses()}
                style={scrollBarStyles()}
                onMouseDown={scrollContext!.scrollToMouseHandler}
                onMouseUp={scrollContext!.stopScrollingToMouse}
            >
                {BarToken()?.children}
                <ScrollHandle parentChildren={BarToken()?.children} />
            </div>
        </Show>
    );
};
