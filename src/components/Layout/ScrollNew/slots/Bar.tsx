import { createMemo, useContext } from 'solid-js';
import { ScrollContext } from '../Scroll';

import styles from '../Scroll.module.css';
import { ScrollBarTokenizer, ScrollHandleTokenizer } from './tokenizers';
import { createToken, createTokenizer, resolveTokens } from '@solid-primitives/jsx-tokenizer';

const scrollContext = useContext(ScrollContext);
const BarTokenizer = createTokenizer();

export const BarComponent = () => {
    const scrollBarStyles = createMemo(() => {
        if (BarToken.style) return { ...BarToken.style };
    });

    const useToken = (tokenizer: any) => {
        const tokens = resolveTokens(tokenizer, () => props.children);
        const token = tokens()[0].data.props;
        return token;
    };

    const BarToken = useToken(BarTokenizer); //BarToken[0].data.props;

    return (
        <div
            class={styles.ScrollBar + ' ' + BarToken.class || ''}
            style={scrollBarStyles()}
            onClick={scrollContext.scrollByClickHandler}
        >
            {BarToken.children}
            <ScrollHandle />
        </div>
    );
};

const BarJSX = (props: any) => {
    return { props };
};
const;
export default createToken(BarTokenizer, BarJSX);
