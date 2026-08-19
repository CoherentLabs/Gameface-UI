import { r as render, c as createComponent } from './web.Dte3IpIp.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.BPvvfgHs.js';
import { C as Content } from './Content.CpwTli_M.js';
import './LayoutBase.pl_BcpgD.js';
import './BaseComponent.C5rMUBcY.js';
import './store.-dvm-_QW.js';

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
