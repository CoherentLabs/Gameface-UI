import { createToken, isToken, JSXTokenizer, resolveTokens } from '@solid-primitives/jsx-tokenizer';
import { ParentProps, JSX, createMemo, createUniqueId, mergeProps } from 'solid-js';
import { AttrProps } from '@components/types/ComponentProps';

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

export type TokenBase = AttrProps & { class?: string; style?: JSX.CSSProperties };

/** A token's `attr:*` props only, for slots rendered through a GFUI component, where `use:forwardAttrs` can't be used. */
export const tokenAttrs = (token: AttrProps | null | undefined): AttrProps => {
    const attrs: AttrProps = {};
    if (!token) return attrs;

    for (const key in token) {
        if (key.startsWith('attr:')) attrs[key as `attr:${string}`] = token[key as `attr:${string}`];
    }

    return attrs;
};

const emptyToken = () => null;

export const createTokenComponent = <T extends Record<string, any>>(withId = false) => {
    return createToken((props: ParentProps<T>) => {
        if (!withId) return { props };

        return { props: mergeProps(props, { _id: withId ? createUniqueId() : undefined }) as ParentProps<T> & { _id?: string } };
    }, emptyToken);
};