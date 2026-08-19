import { r as render, c as createComponent } from './web.Dte3IpIp.js';
import { S as Segment } from './Segment.WMxHht14.js';
import './tokenComponents.Vg66oOOL.js';
import './BaseComponent.C5rMUBcY.js';
import './store.-dvm-_QW.js';
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
