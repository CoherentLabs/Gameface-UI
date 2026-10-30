import { L as LayoutBase } from './LayoutBase.CNacoN_g.js';
import { c as createComponent, m as mergeProps } from './web.fJ3rGgJk.js';

const content = "_content_aas4c_1";
const styles = {
	content: content
};

const Content = (props) => {
  return createComponent(LayoutBase, mergeProps(props, {
    get componentClasses() {
      return styles.content;
    },
    get componentStyles() {
      return {
        "flex-basis": props.basis ? `${props.basis}%` : ""
      };
    }
  }));
};

export { Content as C };
