import { r as render, c as createComponent } from './web.ibFHgs_k.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.B_DFYHvW.js';
import { C as Content } from './Content.CPyO-em8.js';
import './LayoutBase.DEk-c953.js';
import './BaseComponent.DEyWe7lF.js';
import 'coherent-gameface-interaction-manager';
import './store.DBjQIIM3.js';

const xvb3ya = (root) => render(() => createComponent(Layout, {
  get children() {
    return [createComponent(Top, {
      children: "Top Menu"
    }), createComponent(Content, {
      style: {
        display: "flex",
        flexDirection: "column"
      },
      children: "Main Content"
    }), createComponent(Bottom, {
      children: "Bottom Section"
    })];
  }
}), root);

export { xvb3ya as default };
