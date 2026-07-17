import { r as render, c as createComponent } from './web.bikURqO-.js';
import { D as Dropdown } from './Dropdown.DU1MMMBq.js';
import './tokenComponents.ChN_WbXL.js';
import './BaseComponent.C3DpOC_C.js';
import './store.C9Zlw18N.js';
import './InlineTextBlock.COktGIaO.js';
import './getScrollableParent.C3YActer.js';
import './mergeNavigationActions.C3r_vRJZ.js';
import './Scroll.BiLXXrar.js';
import './LayoutBase.Crrr9d-c.js';
import './clamp.BBPiOs3-.js';

const wf44qo = (root) => render(() => createComponent(Dropdown, {
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

export { wf44qo as default };
