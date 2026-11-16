import { r as render, c as createComponent } from './web.DSByG9TV.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.TDnKVhAP.js';
import { C as Content } from './Content.CFTS76s0.js';
import './LayoutBase.H5ylNxTU.js';
import './BaseComponent.u9Ar6trR.js';
import './store.D5_yYWQG.js';

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
