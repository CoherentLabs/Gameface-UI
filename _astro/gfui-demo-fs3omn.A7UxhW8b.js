import { r as render, c as createComponent } from './web.bikURqO-.js';
import { C as Column, R as Row } from './Column.Ca-FMrq3.js';
import './LayoutBase.Crrr9d-c.js';
import './BaseComponent.C3DpOC_C.js';
import './store.C9Zlw18N.js';

const fs3omn = (root) => render(() => [createComponent(Row, {
  get children() {
    return [createComponent(Column.Two, {
      style: {
        "background-color": "#505f49"
      },
      children: "I take 2/12 of the row"
    }), createComponent(Column.Ten, {
      children: "I take 10/12 of the row (the rest of the row)"
    })];
  }
}), createComponent(Row, {
  get children() {
    return createComponent(Column.Twelve, {
      children: "I take the full row"
    });
  }
}), createComponent(Row, {
  get children() {
    return createComponent(Column, {
      children: "I also take the full row"
    });
  }
})], root);

export { fs3omn as default };
