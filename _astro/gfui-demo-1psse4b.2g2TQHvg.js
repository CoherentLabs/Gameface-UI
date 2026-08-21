import { r as render, c as createComponent } from './web.BgHhn69X.js';
import { A as Absolute } from './Absolute.DDo3wFp9.js';
import { B as Block } from './Block.CkY4DVWC.js';
import './LayoutBase.YBdG0cVn.js';
import './BaseComponent.DR8Y59bT.js';
import './store.DVrtUaE7.js';

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
