import { r as render, c as createComponent } from './web.BgHhn69X.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.1B_fotB1.js';
import { C as Content } from './Content.DjJ4TI9o.js';
import './LayoutBase.YBdG0cVn.js';
import './BaseComponent.DR8Y59bT.js';
import './store.DVrtUaE7.js';

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
