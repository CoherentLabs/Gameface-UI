import { r as render, c as createComponent } from './web.BVcuNnQ8.js';
import { A as Absolute } from './Absolute.C8vJ2pO4.js';
import { B as Block } from './Block.DOT3QwAp.js';
import './LayoutBase.BItrAvwF.js';
import './BaseComponent.DPzDIAqq.js';
import './store.BQv4smX3.js';

const _1psse4b = (root) => render(() => createComponent(Absolute, {
  top: "50px",
  right: "50px",
  get children() {
    return createComponent(Block, {
      children: "Content with top and right offset by 50px"
    });
  }
}), root);

export { _1psse4b as default };
