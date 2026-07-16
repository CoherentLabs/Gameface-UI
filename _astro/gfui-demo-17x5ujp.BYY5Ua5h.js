import { r as render, c as createComponent } from './web.ibFHgs_k.js';
import { a as Column2, b as Column10, R as Row, c as Column12 } from './Column.3ZtAm9Ld.js';
import './LayoutBase.DEk-c953.js';
import './BaseComponent.DEyWe7lF.js';
import 'coherent-gameface-interaction-manager';
import './store.DBjQIIM3.js';

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
