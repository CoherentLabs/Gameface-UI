import { r as render, c as createComponent } from './web.fJ3rGgJk.js';
import { C as Column2, a as Column10, R as Row, b as Column12 } from './Column.BbGiDaSo.js';
import './LayoutBase.CNacoN_g.js';
import './BaseComponent.6jspVmqg.js';
import './store.BS9ej-Rw.js';

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
