import { r as render, c as createComponent } from './web.BgHhn69X.js';
import { D as Dropdown } from './Dropdown.DBRe_eDf.js';
import './tokenComponents.DvO1PJlV.js';
import './BaseComponent.DR8Y59bT.js';
import './store.DVrtUaE7.js';
import './InlineTextBlock.B8HXG0rw.js';
import './getScrollableParent.C3YActer.js';
import './mergeNavigationActions.C3r_vRJZ.js';
import './Scroll.BgZJtzdi.js';
import './LayoutBase.YBdG0cVn.js';
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
