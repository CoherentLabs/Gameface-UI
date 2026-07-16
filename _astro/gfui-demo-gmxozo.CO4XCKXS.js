import { r as render, c as createComponent } from './web.e96V-LtU.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.BntN7UQX.js';
import { C as Content } from './Content.CtOfkS9o.js';
import './LayoutBase.D9nt2oGz.js';
import './BaseComponent.BmESB2kC.js';
import 'coherent-gameface-interaction-manager';
import './store.CBj67zxW.js';

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
