import { r as render, c as createComponent } from './web.DoGxwvvO.js';
import { D as Dropdown } from './Dropdown.C9IHZSoC.js';
import './tokenComponents.C6MElWh1.js';
import './BaseComponent.DmBIQgSj.js';
import './store.BChLrIuc.js';
import './InlineTextBlock.DoiA0RIT.js';
import './getScrollableParent.C3YActer.js';
import './mergeNavigationActions.C3r_vRJZ.js';
import './Scroll.WFzKwYjT.js';
import './LayoutBase.V5Pt4GTE.js';
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
