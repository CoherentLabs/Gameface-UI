import { r as render, c as createComponent } from './web.Ztxum33j.js';
import { S as Segment } from './Segment.Dbh-F-lq.js';
import './tokenComponents.BJf1S0ca.js';
import './BaseComponent.GQpAABre.js';
import './store.uQYBwfFf.js';
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
