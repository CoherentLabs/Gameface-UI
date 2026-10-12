import { r as render, c as createComponent } from './web.PcCDJqbu.js';
import { S as Segment } from './Segment.ClTUJD3J.js';
import './tokenComponents.TNOn7o7y.js';
import './BaseComponent.Irprgzr9.js';
import './store.BnPMRy2B.js';
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
