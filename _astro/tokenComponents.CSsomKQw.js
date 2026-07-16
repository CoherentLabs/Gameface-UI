import { createToken, resolveTokens, isToken } from '@solid-primitives/jsx-tokenizer';
import { m as mergeProps, b as createMemo, d as createUniqueId } from './web.ibFHgs_k.js';

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
