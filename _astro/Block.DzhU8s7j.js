import { L as LayoutBase } from './LayoutBase.DEk-c953.js';
import { c as createComponent, m as mergeProps } from './web.ibFHgs_k.js';

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
