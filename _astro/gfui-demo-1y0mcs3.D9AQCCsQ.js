import { r as render, c as createComponent } from './web.PcCDJqbu.js';
import { C as Content } from './Content.C60VJpu_.js';
import { T as Transform } from './Transform.Dte6d5Ce.js';
import './LayoutBase.-cwEytOC.js';
import './BaseComponent.Irprgzr9.js';
import './store.BnPMRy2B.js';

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
