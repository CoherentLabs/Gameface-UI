import { r as render, c as createComponent } from './web.BVcuNnQ8.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.DaGgblH4.js';
import { C as Content } from './Content.NDUrnR4P.js';
import './LayoutBase.BItrAvwF.js';
import './BaseComponent.DPzDIAqq.js';
import './store.BQv4smX3.js';

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
