import { r as render, c as createComponent } from './web.fJ3rGgJk.js';
import { S as Segment } from './Segment.Dgg7Kkah.js';
import './tokenComponents.JX_18n2r.js';
import './BaseComponent.6jspVmqg.js';
import './store.BS9ej-Rw.js';
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
