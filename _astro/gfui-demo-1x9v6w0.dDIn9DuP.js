import { r as render, c as createComponent } from './web.e96V-LtU.js';
import { S as Segment } from './Segment.DmLWvjZT.js';
import './tokenComponents.hFDI9VqW.js';
import '@solid-primitives/jsx-tokenizer';
import './BaseComponent.BmESB2kC.js';
import 'coherent-gameface-interaction-manager';
import './store.CBj67zxW.js';
import './mergeNavigationActions.C3r_vRJZ.js';

const _1x9v6w0 = (root) => render(() => createComponent(Segment, {
  get children() {
    return [createComponent(Segment.Button, {
      selected: true,
      value: "red",
      children: "red"
    }), createComponent(Segment.Button, {
      value: "green",
      children: "green"
    }), createComponent(Segment.Button, {
      value: "blue",
      children: "blue"
    })];
  }
}), root);

export { _1x9v6w0 as default };
