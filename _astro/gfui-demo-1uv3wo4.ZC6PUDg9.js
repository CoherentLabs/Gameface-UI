import { r as render, c as createComponent } from './web.BgHhn69X.js';
import { S as Scroll } from './Scroll.BgZJtzdi.js';
import { T as TextBlock } from './TextBlock.CAQzRoi4.js';
import './LayoutBase.YBdG0cVn.js';
import './BaseComponent.DR8Y59bT.js';
import './store.DVrtUaE7.js';
import './clamp.BBPiOs3-.js';
import './tokenComponents.DvO1PJlV.js';

const _1uv3wo4 = (root) => render(() => createComponent(Scroll, {
  style: {
    "max-width": "200px",
    "max-height": "100px"
  },
  get children() {
    return createComponent(Scroll.Content, {
      get children() {
        return createComponent(TextBlock, {
          children: "I am a very long and dynamic text that can be scrolled - lorem Eaque, perspiciatis ad iusto expedita consectetur rerum tempora non nisi, porro tenetur repudiandae. Voluptatem magni dolore consequuntur officia nemo quidem minus. Possimus, quibusdam."
        });
      }
    });
  }
}), root);

export { _1uv3wo4 as default };
