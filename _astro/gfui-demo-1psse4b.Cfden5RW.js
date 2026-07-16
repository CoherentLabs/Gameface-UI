import { r as render, c as createComponent } from './web.DT9QqbDn.js';
import { A as Absolute } from './Absolute.BAW1c246.js';
import { B as Block } from './Block.YrriXaXc.js';
import './LayoutBase.DvNSSl3m.js';
import './BaseComponent.dZiros1M.js';
import './store.CXp9XCH2.js';

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
