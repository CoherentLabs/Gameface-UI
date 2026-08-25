import { r as render, c as createComponent } from './web.DoGxwvvO.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.9vM98MT7.js';
import { C as Content } from './Content.DSX-LQxv.js';
import './LayoutBase.V5Pt4GTE.js';
import './BaseComponent.DmBIQgSj.js';
import './store.BChLrIuc.js';

const _83n4w7 = (root) => render(() => createComponent(Layout, {
  style: {
    height: "100vh"
  },
  get children() {
    return [createComponent(Top, {
      children: "Top Section"
    }), createComponent(Content, {
      children: "Main Content"
    }), createComponent(Bottom, {
      children: "Bottom Section"
    })];
  }
}), root);

export { _83n4w7 as default };
