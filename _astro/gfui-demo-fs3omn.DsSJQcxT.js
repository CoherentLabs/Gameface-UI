import { r as render, c as createComponent } from './web.Ztxum33j.js';
import { c as Column, R as Row } from './Column.C3Rg3qg3.js';
import './LayoutBase.B3V5Tjb8.js';
import './BaseComponent.GQpAABre.js';
import './store.uQYBwfFf.js';

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
