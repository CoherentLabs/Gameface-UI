import { r as render, c as createComponent } from './web.Ztxum33j.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.CGyMtr9z.js';
import { C as Content } from './Content.C2gLmpp_.js';
import './LayoutBase.B3V5Tjb8.js';
import './BaseComponent.GQpAABre.js';
import './store.uQYBwfFf.js';

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
