import { r as render, c as createComponent } from './web.DT9QqbDn.js';
import { S as Segment } from './Segment.Cy9DmJVh.js';
import './tokenComponents.D7hEHUQ6.js';
import './BaseComponent.dZiros1M.js';
import './store.CXp9XCH2.js';
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
