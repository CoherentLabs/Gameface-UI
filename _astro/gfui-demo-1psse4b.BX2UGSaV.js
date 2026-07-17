import { r as render, c as createComponent } from './web.bikURqO-.js';
import { A as Absolute } from './Absolute.CNErIHNJ.js';
import { B as Block } from './Block.D0mtNQi7.js';
import './LayoutBase.Crrr9d-c.js';
import './BaseComponent.C3DpOC_C.js';
import './store.C9Zlw18N.js';

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
