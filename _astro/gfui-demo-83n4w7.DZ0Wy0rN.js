import { r as render, c as createComponent } from './web.Dte3IpIp.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.BPvvfgHs.js';
import { C as Content } from './Content.CpwTli_M.js';
import './LayoutBase.pl_BcpgD.js';
import './BaseComponent.C5rMUBcY.js';
import './store.-dvm-_QW.js';

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
