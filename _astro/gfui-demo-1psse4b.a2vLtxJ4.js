import { r as render, c as createComponent } from './web.DoGxwvvO.js';
import { A as Absolute } from './Absolute.BPxQK_Ps.js';
import { B as Block } from './Block.CtarwKwI.js';
import './LayoutBase.V5Pt4GTE.js';
import './BaseComponent.DmBIQgSj.js';
import './store.BChLrIuc.js';

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
