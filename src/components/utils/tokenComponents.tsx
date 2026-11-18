import { createToken, isToken, JSXTokenizer, resolveTokens } from './jsx-tokenizer';
import { ParentProps, createMemo, createUniqueId, merge } from 'solid-js';
import { JSX } from '@solidjs/web';

type TokenizerType<T extends Record<string, any>> = JSXTokenizer<{ props: ParentProps<T> }>;

/**
 * Finds the first token of `tokenizer` in the children.
 * `parentChildren` is an accessor (`() => props.children`), so the result
 * follows changes to the children (Solid 2: no untracked read in setup).
 */
export const useToken = <T extends Record<string, any>>(tokenizer: TokenizerType<T>, parentChildren: () => JSX.Element) => {
    const tokens = resolveTokens(tokenizer, parentChildren, { includeJSXElements: true });

    return createMemo(() => {
        const token = tokens().find(token => isToken(tokenizer, token));
        return token ? token.data.props : null;
    });
};

/** Finds all tokens of `tokenizer` in the children, in order. See {@link useToken}. */
export const useTokens = <T extends Record<string, any>>(tokenizer: TokenizerType<T>, parentChildren: () => JSX.Element) => {
    const tokens = resolveTokens(tokenizer, parentChildren, { includeJSXElements: true });

    return createMemo(() => {
        const found = tokens().reduce((acc, token) => {
            if (isToken(tokenizer, token)) acc.push(token.data.props);

            return acc;
        }, [] as ParentProps<T>[]);

        return found.length ? found : null;
    });
};

export type TokenBase = { class?: string; style?: JSX.CSSProperties };

const emptyToken = () => null;

export const createTokenComponent = <T extends Record<string, any>>(withId = false) => {
    return createToken((props: ParentProps<T>) => {
        if (!withId) return { props };

        return { props: merge(props, { _id: createUniqueId() }) as ParentProps<T> & { _id?: string } };
    }, emptyToken);
};
