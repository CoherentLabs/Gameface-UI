import { b as createMemo, c as createComponent, m as mergeProps, r as render } from './web.ibFHgs_k.js';
import { L as LayoutBase } from './LayoutBase.DEk-c953.js';
import { B as Block } from './Block.DzhU8s7j.js';
import './BaseComponent.DEyWe7lF.js';
import 'coherent-gameface-interaction-manager';
import './store.DBjQIIM3.js';

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

const _1lm50g8 = (root) => render(() => createComponent(Relative, {
  top: "50px",
  right: "50px",
  get children() {
    return createComponent(Block, {
      children: "Content with top and right offset by 50px"
    });
  }
}), root);

export { _1lm50g8 as default };
