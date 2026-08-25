import { r as render, c as createComponent } from './web.DoGxwvvO.js';
import { S as Segment } from './Segment.COQ8CUO4.js';
import './tokenComponents.C6MElWh1.js';
import './BaseComponent.DmBIQgSj.js';
import './store.BChLrIuc.js';
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
