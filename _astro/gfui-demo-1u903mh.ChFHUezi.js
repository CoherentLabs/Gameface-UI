import { r as render, c as createComponent } from './web.DoGxwvvO.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.9vM98MT7.js';
import { C as Content } from './Content.DSX-LQxv.js';
import './LayoutBase.V5Pt4GTE.js';
import './BaseComponent.DmBIQgSj.js';
import './store.BChLrIuc.js';

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
