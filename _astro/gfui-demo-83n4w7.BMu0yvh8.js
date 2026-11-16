import { r as render, c as createComponent } from './web.DSByG9TV.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.TDnKVhAP.js';
import { C as Content } from './Content.CFTS76s0.js';
import './LayoutBase.H5ylNxTU.js';
import './BaseComponent.u9Ar6trR.js';
import './store.D5_yYWQG.js';

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
