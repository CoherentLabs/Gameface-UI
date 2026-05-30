import { createToken, isToken, JSXTokenizer, resolveTokens } from '@solid-primitives/jsx-tokenizer';
import { JSX } from '@solidjs/web';
import { ParentProps, createMemo, createUniqueId, merge } from 'solid-js';

type TokenizerType<T extends Record<string, any>> = JSXTokenizer<{ props: ParentProps<T> }>;

export const useToken = <T extends Record<string, any>>(tokenizer: TokenizerType<T>, getChildren: () => JSX.Element) => {
    return createMemo(() => {
        const parentChildren = getChildren(); 
        if (!parentChildren) return null;

        const tokens = resolveTokens(tokenizer, () => parentChildren, { includeJSXElements: true })();
        if (!tokens || tokens.length === 0) return null;

        return tokens.find(token => isToken(tokenizer, token))?.data.props;
    });
};

export const useTokens = <T extends Record<string, any>>(tokenizer: TokenizerType<T>, getChildren: () => JSX.Element) => {
    return createMemo(() => {
        const parentChildren = getChildren(); 
        if (!parentChildren) return null;

        const tokens = resolveTokens(tokenizer, () => parentChildren, { includeJSXElements: true })();
        if (!tokens || tokens.length === 0) return null;

        return tokens.reduce((acc, token) => {
            if (isToken(tokenizer, token)) acc.push(token.data.props);

            return acc;
        }, [] as ParentProps<T>[]);
    });
};

export type TokenBase = { class?: string; style?: JSX.CSSProperties };

const emptyToken = () => null;

export const createTokenComponent = <T extends Record<string, any>>(withId = false) => {
    return createToken((props: ParentProps<T>) => {
        if (!withId) return { props };

        return { props: merge(props, { _id: withId ? createUniqueId() : undefined }) as ParentProps<T> & { _id?: string } };
    }, emptyToken);
};