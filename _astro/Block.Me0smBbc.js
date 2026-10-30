import { L as LayoutBase } from './LayoutBase.CNacoN_g.js';
import { c as createComponent, m as mergeProps } from './web.fJ3rGgJk.js';

const Block = (props) => {
  return createComponent(LayoutBase, mergeProps(props, {
    get componentStyles() {
      return {
        width: props.width ?? void 0,
        height: props.height ?? void 0
      };
    }
  }));
};

export { Block as B };
