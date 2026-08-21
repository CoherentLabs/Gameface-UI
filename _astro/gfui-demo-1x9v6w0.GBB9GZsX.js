import { r as render, c as createComponent } from './web.BgHhn69X.js';
import { S as Segment } from './Segment.CnhaqeiA.js';
import './tokenComponents.DvO1PJlV.js';
import './BaseComponent.DR8Y59bT.js';
import './store.DVrtUaE7.js';
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
