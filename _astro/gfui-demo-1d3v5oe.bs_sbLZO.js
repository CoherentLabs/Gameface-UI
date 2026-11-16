import { r as render, c as createComponent } from './web.DSByG9TV.js';
import { T as ToggleButton } from './ToggleButton.C0p_qIPH.js';
import './tokenComponents.CcMO5ptL.js';
import './BaseComponent.u9Ar6trR.js';
import './store.D5_yYWQG.js';
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
