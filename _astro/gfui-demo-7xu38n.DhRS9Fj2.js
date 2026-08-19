import { r as render, c as createComponent } from './web.Dte3IpIp.js';
import { D as Dropdown } from './Dropdown.irlAbCnd.js';
import './tokenComponents.Vg66oOOL.js';
import './BaseComponent.C5rMUBcY.js';
import './store.-dvm-_QW.js';
import './InlineTextBlock.CFViRBE3.js';
import './getScrollableParent.C3YActer.js';
import './mergeNavigationActions.C3r_vRJZ.js';
import './Scroll.BhzrsNja.js';
import './LayoutBase.pl_BcpgD.js';
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
