import { r as render, c as createComponent } from './web.fJ3rGgJk.js';
import { T as ToggleButton } from './ToggleButton.C7n-qLgm.js';
import './tokenComponents.JX_18n2r.js';
import './BaseComponent.6jspVmqg.js';
import './store.BS9ej-Rw.js';
import './mergeNavigationActions.C3r_vRJZ.js';

const _1d3v5oe = (root) => render(() => createComponent(ToggleButton, {
  get children() {
    return [createComponent(ToggleButton.LabelLeft, {
      children: "Off"
    }), createComponent(ToggleButton.LabelRight, {
      children: "On"
    })];
  }
}), root);

export { _1d3v5oe as default };
