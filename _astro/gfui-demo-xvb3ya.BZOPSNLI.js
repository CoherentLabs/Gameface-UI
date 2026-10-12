import { r as render, c as createComponent } from './web.PcCDJqbu.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.CuvoDPfc.js';
import { C as Content } from './Content.C60VJpu_.js';
import './LayoutBase.-cwEytOC.js';
import './BaseComponent.Irprgzr9.js';
import './store.BnPMRy2B.js';

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
