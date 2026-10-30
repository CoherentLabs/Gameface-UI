import { r as render, c as createComponent } from './web.fJ3rGgJk.js';
import { A as Absolute } from './Absolute.Dh-g2X6u.js';
import { B as Block } from './Block.Me0smBbc.js';
import './LayoutBase.CNacoN_g.js';
import './BaseComponent.6jspVmqg.js';
import './store.BS9ej-Rw.js';

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
