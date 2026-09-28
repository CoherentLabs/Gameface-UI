import { r as render, c as createComponent } from './web.Ztxum33j.js';
import { R as Relative } from './Relative.Cs7VfUe5.js';
import { B as Block } from './Block.Cqd26thH.js';
import './LayoutBase.B3V5Tjb8.js';
import './BaseComponent.GQpAABre.js';
import './store.uQYBwfFf.js';

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
