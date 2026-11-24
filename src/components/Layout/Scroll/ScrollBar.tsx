import { createMemo, ParentComponent, Show, useContext, ParentProps } from 'solid-js';
import { ScrollContext } from './Scroll';
import styles from './Scroll.module.scss';
import { createTokenComponent, TokenBase, useToken } from '@components/utils/tokenComponents';
import { forwardAttrs } from '@components/BaseComponent/BaseComponent';
import { ScrollHandle } from './ScrollHandle';
import { TokenComponentProps } from '@components/types/ComponentProps';

export interface BarTokenProps extends ParentProps<TokenBase> { }

export const Bar = createTokenComponent<BarTokenProps>();

export const ScrollBar: ParentComponent<TokenComponentProps> = (props) => {
    const scrollContext = useContext(ScrollContext);
    const BarToken = useToken(Bar, props.parentChildren);

    const scrollBarStyles = createMemo(() => {
        const token = BarToken();
        if (token && token.style) return { ...token.style };
    });

    const scrollBarClasses = createMemo(() => {
        if (BarToken()?.class) return styles['scroll-bar'] + ' ' + BarToken()?.class;

        return styles['scroll-bar'];
    });

    return (
        <Show when={scrollContext?.overflow()}>
            <div
                class={scrollBarClasses()}
                style={scrollBarStyles()}
                onMouseDown={scrollContext!.scrollToMouseHandler}
                use:forwardAttrs={BarToken()}
            >
                {BarToken()?.children}
                <ScrollHandle parentChildren={BarToken()?.children} />
            </div>
        </Show>
    );
};
