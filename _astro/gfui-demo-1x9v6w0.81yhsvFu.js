import { r as render, c as createComponent } from './web.bikURqO-.js';
import { S as Segment } from './Segment.CxSo6QR4.js';
import './tokenComponents.ChN_WbXL.js';
import './BaseComponent.C3DpOC_C.js';
import './store.C9Zlw18N.js';
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
