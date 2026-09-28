import { L as LayoutBase } from './LayoutBase.B3V5Tjb8.js';
import { c as createComponent, m as mergeProps } from './web.Ztxum33j.js';

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
