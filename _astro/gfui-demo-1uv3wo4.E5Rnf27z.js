import { r as render, c as createComponent } from './web.DSByG9TV.js';
import { S as Scroll } from './Scroll.CZur5NHx.js';
import { T as TextBlock } from './TextBlock.BkHhl__-.js';
import './LayoutBase.H5ylNxTU.js';
import './BaseComponent.u9Ar6trR.js';
import './store.D5_yYWQG.js';
import './clamp.BBPiOs3-.js';
import './tokenComponents.CcMO5ptL.js';

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
