import { r as render, c as createComponent } from './web.DT9QqbDn.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.oC4Du8S9.js';
import { C as Content } from './Content.3VPKrM2j.js';
import './LayoutBase.DvNSSl3m.js';
import './BaseComponent.dZiros1M.js';
import './store.CXp9XCH2.js';

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
