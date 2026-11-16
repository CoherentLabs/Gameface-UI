import { k as createMemo, c as createComponent, m as mergeProps } from './web.DSByG9TV.js';
import { L as LayoutBase } from './LayoutBase.H5ylNxTU.js';

const relative = "_relative_1njuo_1";
const styles = {
	relative: relative
};

const Relative = (props) => {
  const positionStyle = createMemo(() => {
    return {
      top: props.top,
      left: props.left,
      right: props.right,
      bottom: props.bottom
    };
  });
  return createComponent(LayoutBase, mergeProps(props, {
    get componentClasses() {
      return styles.relative;
    },
    componentStyles: positionStyle
  }));
};

export { Relative as R };
