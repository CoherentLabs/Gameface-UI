import { r as render, c as createComponent } from './web.bikURqO-.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.CHRMv5tA.js';
import { C as Content } from './Content.D1FtbPCQ.js';
import './LayoutBase.Crrr9d-c.js';
import './BaseComponent.C3DpOC_C.js';
import './store.C9Zlw18N.js';

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
