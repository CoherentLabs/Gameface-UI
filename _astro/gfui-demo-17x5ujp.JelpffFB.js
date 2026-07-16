import { r as render, c as createComponent } from './web.e96V-LtU.js';
import { a as Column2, b as Column10, R as Row, c as Column12 } from './Column.DNAKXFK8.js';
import './LayoutBase.D9nt2oGz.js';
import './BaseComponent.BmESB2kC.js';
import 'coherent-gameface-interaction-manager';
import './store.CBj67zxW.js';

const _17x5ujp = (root) => render(() => [createComponent(Row, {
  get children() {
    return [createComponent(Column2, {
      children: "I take 2/12 of the row"
    }), createComponent(Column10, {
      children: "I take 10/12 of the row"
    })];
  }
}), createComponent(Row, {
  get children() {
    return createComponent(Column12, {
      children: "I take the full row"
    });
  }
})], root);

export { _17x5ujp as default };
