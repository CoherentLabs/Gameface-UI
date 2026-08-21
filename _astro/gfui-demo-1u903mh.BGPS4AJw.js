import { r as render, c as createComponent } from './web.BgHhn69X.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.1B_fotB1.js';
import { C as Content } from './Content.DjJ4TI9o.js';
import './LayoutBase.YBdG0cVn.js';
import './BaseComponent.DR8Y59bT.js';
import './store.DVrtUaE7.js';

const _1u903mh = (root) => render(() => createComponent(Layout, {
  get children() {
    return [createComponent(Top, {
      children: "Top Menu"
    }), createComponent(Content, {
      children: "Main Content"
    }), createComponent(Bottom, {
      children: "Bottom Section"
    })];
  }
}), root);

export { _1u903mh as default };
