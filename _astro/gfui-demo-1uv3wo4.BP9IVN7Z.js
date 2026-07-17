import { r as render, c as createComponent } from './web.bikURqO-.js';
import { S as Scroll } from './Scroll.BiLXXrar.js';
import { T as TextBlock } from './TextBlock.DQVAk4Mv.js';
import './LayoutBase.Crrr9d-c.js';
import './BaseComponent.C3DpOC_C.js';
import './store.C9Zlw18N.js';
import './clamp.BBPiOs3-.js';
import './tokenComponents.ChN_WbXL.js';

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
