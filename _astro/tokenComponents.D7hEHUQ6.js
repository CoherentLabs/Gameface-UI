import { c as createComponent, b as createMemo, m as mergeProps, v as createUniqueId } from './web.DT9QqbDn.js';

const asArray = (value) => Array.isArray(value) ? value : value ? [value] : [];

/** @internal */
const $TOKENIZER = Symbol("");
function createToken(...args) {
    const symbol = (args[0]?.[$TOKENIZER] ? args.shift()[$TOKENIZER] : undefined) ??
        Symbol("");
    const comp = ((props) => {
        const token = (args[1]
            ? () => createComponent(args[1], props)
            : () => {
                return "";
            });
        token.data = args[0] ? args[0](props) : props;
        token[$TOKENIZER] = symbol;
        return token;
    });
    comp[$TOKENIZER] = symbol;
    return comp;
}
function getResolvedTokens(resolved, value, symbols, addElements) {
    // function
    if (typeof value === "function" && !value.length) {
        if (symbols.has(value[$TOKENIZER]))
            resolved.push(value);
        else
            getResolvedTokens(resolved, value(), symbols, addElements);
    }
    // array
    else if (Array.isArray(value))
        for (let i = 0; i < value.length; i++)
            getResolvedTokens(resolved, value[i], symbols, addElements);
    // other element
    else if (addElements)
        resolved.push(value);
    else ;
    return resolved;
}
function resolveTokens(tokenizers, fn, options) {
    const symbols = new Set(asArray(tokenizers).map(p => p[$TOKENIZER]));
    const children = createMemo(fn);
    return createMemo(() => getResolvedTokens([], children(), symbols, options?.includeJSXElements));
}
function isToken(parsers, value) {
    if (typeof value !== "function" || !($TOKENIZER in value))
        return false;
    const symbol = value[$TOKENIZER];
    return Array.isArray(parsers)
        ? parsers.some(p => p[$TOKENIZER] === symbol)
        : parsers[$TOKENIZER] === symbol;
}

const useToken = (tokenizer, parentChildren) => {
  return createMemo(() => {
    if (!parentChildren) return null;
    const tokens = resolveTokens(tokenizer, () => parentChildren, {
      includeJSXElements: true
    })();
    if (!tokens || tokens.length === 0) return null;
    return tokens.find((token) => isToken(tokenizer, token))?.data.props;
  });
};
const useTokens = (tokenizer, parentChildren) => {
  return createMemo(() => {
    if (!parentChildren) return null;
    const tokens = resolveTokens(tokenizer, () => parentChildren, {
      includeJSXElements: true
    })();
    if (!tokens || tokens.length === 0) return null;
    return tokens.reduce((acc, token) => {
      if (isToken(tokenizer, token)) acc.push(token.data.props);
      return acc;
    }, []);
  });
};
const emptyToken = () => null;
const createTokenComponent = (withId = false) => {
  return createToken((props) => {
    if (!withId) return {
      props
    };
    return {
      props: mergeProps(props, {
        _id: withId ? createUniqueId() : void 0
      })
    };
  }, emptyToken);
};

export { useTokens as a, createTokenComponent as c, useToken as u };
