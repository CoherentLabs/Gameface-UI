import { r as render, c as createComponent } from './web.BgHhn69X.js';
import { C as Content } from './Content.DjJ4TI9o.js';
import { T as Transform } from './Transform.Bi5AnHFa.js';
import './LayoutBase.YBdG0cVn.js';
import './BaseComponent.DR8Y59bT.js';
import './store.DVrtUaE7.js';

const _1y0mcs3 = (root) => render(() => createComponent(Content, {
  get children() {
    return [createComponent(Transform, {
      rotate: {
        z: 15
      },
      origin: "top right",
      children: "Rotated by 15°, originating from the top right corner of the element."
    }), createComponent(Transform, {
      matrix: {
        translate: {
          x: 15
        },
        skew: {
          x: 15
        },
        scale: {
          x: 1.5,
          y: 1.5
        }
      },
      children: "Moved to the right by 15px, skewed by 15deg and increased the width and height of the element by 1.5"
    })];
  }
}), root);

export { _1y0mcs3 as default };
