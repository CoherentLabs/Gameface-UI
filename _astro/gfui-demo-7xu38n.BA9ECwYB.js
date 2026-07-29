import { r as render, c as createComponent } from './web.BVcuNnQ8.js';
import { D as Dropdown } from './Dropdown.1pSZIWWS.js';
import './tokenComponents.sshVCBVx.js';
import './BaseComponent.DPzDIAqq.js';
import './store.BQv4smX3.js';
import './InlineTextBlock.Dz1vm3nC.js';
import './getScrollableParent.C3YActer.js';
import './mergeNavigationActions.C3r_vRJZ.js';
import './Scroll.CPUaWB7Q.js';
import './LayoutBase.BItrAvwF.js';
import './clamp.BBPiOs3-.js';

const _7xu38n = (root) => render(() => createComponent(Dropdown, {
  style: {
    width: "10rem"
  },
  get children() {
    return createComponent(Dropdown.Options, {
      get children() {
        return [createComponent(Dropdown.Option, {
          selected: true,
          value: "red",
          children: "red"
        }), createComponent(Dropdown.Option, {
          value: "green",
          children: "green"
        }), createComponent(Dropdown.Option, {
          value: "blue",
          children: "blue"
        })];
      }
    });
  }
}), root);

export { _7xu38n as default };
