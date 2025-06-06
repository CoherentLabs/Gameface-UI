import { createMemo, JSX, ParentComponent, useContext } from 'solid-js';
import { ScrollContext } from './Scroll';
import styles from './Scroll.module.css';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { ScrollHandle } from './ScrollHandle';
import { TokenComponentProps } from '@components/types/ComponentProps';

interface BarTokenProps {
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
        <div
            class={scrollBarClasses()}
            style={scrollBarStyles()}
            onClick={scrollContext!.scrollByClickHandler}
        >
            {BarToken()?.children}
            <ScrollHandle parentChildren={BarToken()?.children} />
        </div>
    );
};
