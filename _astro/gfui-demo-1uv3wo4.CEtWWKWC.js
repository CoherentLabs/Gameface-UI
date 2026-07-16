import { r as render, c as createComponent } from './web.DT9QqbDn.js';
import { S as Scroll } from './Scroll.Bc6P75rB.js';
import { T as TextBlock } from './TextBlock.D0C-gwIP.js';
import './LayoutBase.DvNSSl3m.js';
import './BaseComponent.dZiros1M.js';
import './store.CXp9XCH2.js';
import './clamp.BBPiOs3-.js';
import './tokenComponents.D7hEHUQ6.js';

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
