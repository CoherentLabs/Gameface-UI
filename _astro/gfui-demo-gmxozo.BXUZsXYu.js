import { r as render, c as createComponent } from './web.Dte3IpIp.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.BPvvfgHs.js';
import { C as Content } from './Content.CpwTli_M.js';
import './LayoutBase.pl_BcpgD.js';
import './BaseComponent.C5rMUBcY.js';
import './store.-dvm-_QW.js';

const gmxozo = (root) => render(() => createComponent(Layout, {
  get children() {
    return [createComponent(Top, {
      basis: 30,
      style: {
        display: "flex",
        flexDirection: "column"
      },
      children: "Top Menu"
    }), createComponent(Content, {
      children: "Main Content"
    }), createComponent(Bottom, {
      children: "Bottom Section"
    })];
  }
}), root);

export { gmxozo as default };
