import { b as createMemo, c as createComponent, m as mergeProps, r as render } from './web.DT9QqbDn.js';
import { L as LayoutBase } from './LayoutBase.DvNSSl3m.js';
import { B as Block } from './Block.YrriXaXc.js';
import './BaseComponent.dZiros1M.js';
import './store.CXp9XCH2.js';

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
