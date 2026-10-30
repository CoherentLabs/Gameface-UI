import { r as render, c as createComponent } from './web.fJ3rGgJk.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.DuKfnIpw.js';
import { C as Content } from './Content.BnSMKtzw.js';
import './LayoutBase.CNacoN_g.js';
import './BaseComponent.6jspVmqg.js';
import './store.BS9ej-Rw.js';

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
