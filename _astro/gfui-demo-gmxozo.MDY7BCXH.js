import { r as render, c as createComponent } from './web.PcCDJqbu.js';
import { T as Top, B as Bottom, L as Layout } from './Layout.CuvoDPfc.js';
import { C as Content } from './Content.C60VJpu_.js';
import './LayoutBase.-cwEytOC.js';
import './BaseComponent.Irprgzr9.js';
import './store.BnPMRy2B.js';

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
