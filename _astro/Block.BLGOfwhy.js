import { L as LayoutBase } from './LayoutBase.D9nt2oGz.js';
import { c as createComponent, m as mergeProps } from './web.e96V-LtU.js';

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
