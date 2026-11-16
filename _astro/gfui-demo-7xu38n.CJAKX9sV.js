import { r as render, c as createComponent } from './web.DSByG9TV.js';
import { D as Dropdown } from './Dropdown.BfdFkEL-.js';
import './tokenComponents.CcMO5ptL.js';
import './BaseComponent.u9Ar6trR.js';
import './store.D5_yYWQG.js';
import './InlineTextBlock.D8gazwja.js';
import './getScrollableParent.C3YActer.js';
import './mergeNavigationActions.C3r_vRJZ.js';
import './Scroll.CZur5NHx.js';
import './LayoutBase.H5ylNxTU.js';
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
