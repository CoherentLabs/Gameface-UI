import { r as render, c as createComponent } from './web.DoGxwvvO.js';
import { R as Relative } from './Relative.BUr6YPMP.js';
import { B as Block } from './Block.CtarwKwI.js';
import './LayoutBase.V5Pt4GTE.js';
import './BaseComponent.DmBIQgSj.js';
import './store.BChLrIuc.js';

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
