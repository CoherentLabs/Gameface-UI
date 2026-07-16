import { r as render, c as createComponent } from './web.ibFHgs_k.js';
import { A as Absolute } from './Absolute.CW64j8O-.js';
import { B as Block } from './Block.DzhU8s7j.js';
import './LayoutBase.DEk-c953.js';
import './BaseComponent.DEyWe7lF.js';
import 'coherent-gameface-interaction-manager';
import './store.DBjQIIM3.js';

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
