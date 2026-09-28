import { r as render, c as createComponent } from './web.Ztxum33j.js';
import { A as Absolute } from './Absolute.DdfVicNL.js';
import { B as Block } from './Block.Cqd26thH.js';
import './LayoutBase.B3V5Tjb8.js';
import './BaseComponent.GQpAABre.js';
import './store.uQYBwfFf.js';

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
