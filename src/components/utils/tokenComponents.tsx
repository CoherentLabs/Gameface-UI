import { createToken, isToken, JSXTokenizer, resolveTokens } from '@solid-primitives/jsx-tokenizer';
import { JSX, createMemo, createUniqueId, mergeProps } from 'solid-js';
import { AttrProps } from '@components/types/ComponentProps';

type TokenizerType<T extends Record<string, any>> = JSXTokenizer<{ props: T }>;

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
        }, [] as T[]);
    });
};

export type TokenBase = AttrProps & {
    class?: string;
    style?: JSX.CSSProperties;
};

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

/**
 * Blocks the `ref` Solid adds to every component: a token renders nothing, and slots don't call it.
 * A slot that declares its own `ref` keeps it.
 */
type SlotProps<T> = 'ref' extends keyof T ? T : T & { ref?: never };

/**
 * Creates a slot token. `T` is the props the slot accepts.
 * Without a generic, `T` is `TokenBase`: `class`, `style` and `attr:*`, no `children`.
 * A slot that renders its children opts in with `createTokenComponent<ParentProps<TokenBase>>()`.
 */
export const createTokenComponent = <T extends Record<string, any> = TokenBase>(withId = false) => {
    return createToken((props: SlotProps<T>) => {
        if (!withId) return { props };

        return { props: mergeProps(props, { _id: createUniqueId() }) as SlotProps<T> & { _id: string } };
    }, emptyToken);
};