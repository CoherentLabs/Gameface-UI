import { createToken, isToken, JSXTokenizer, resolveTokens } from '@solid-primitives/jsx-tokenizer';
import { ParentProps, JSX, createMemo } from 'solid-js';

type TokenizerType<T extends Record<string, any>> = JSXTokenizer<{ props: ParentProps<T> }>;

export const useToken = <T extends Record<string, any>>(tokenizer: TokenizerType<T>, parentChildren: JSX.Element) => {
    return createMemo(() => {
        if (!parentChildren) return null;

        const tokens = resolveTokens(tokenizer, () => parentChildren, { includeJSXElements: true })();
        if (!tokens || tokens.length === 0) return null;

        return tokens.find(token => isToken(tokenizer, token))?.data.props;
    });
};

export const useTokens = <T extends Record<string, any>>(tokenizer: TokenizerType<T>, parentChildren: JSX.Element) => {
    return createMemo(() => {
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

export const createTokenComponent = <T extends Record<string, any>>(name?: string) => {
    return createToken((props: ParentProps<T>) => {
        return { props };
    }, () => null);
};