import { r as render, c as createComponent } from './web.PcCDJqbu.js';
import { D as Dropdown } from './Dropdown.BHiqF6fW.js';
import './tokenComponents.TNOn7o7y.js';
import './BaseComponent.BcUYgHqW.js';
import './store.BnPMRy2B.js';
import './InlineTextBlock.BmAj69ks.js';
import './getScrollableParent.C3YActer.js';
import './mergeNavigationActions.C3r_vRJZ.js';
import './Scroll.CamIiSoB.js';
import './LayoutBase.BnpdRw2f.js';
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
