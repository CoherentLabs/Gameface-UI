import { r as render, c as createComponent } from './web.PcCDJqbu.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.CYwCKY7s.js';
import { C as Content } from './Content.BwAW2Nog.js';
import './LayoutBase.BnpdRw2f.js';
import './BaseComponent.BcUYgHqW.js';
import './store.BnPMRy2B.js';

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
