import { r as render, c as createComponent } from './web.e96V-LtU.js';
import { S as Scroll } from './Scroll.DVSQpjnf.js';
import { T as TextBlock } from './TextBlock.BbnmDg78.js';
import './LayoutBase.D9nt2oGz.js';
import './BaseComponent.BmESB2kC.js';
import 'coherent-gameface-interaction-manager';
import './store.CBj67zxW.js';
import './clamp.BBPiOs3-.js';
import './tokenComponents.hFDI9VqW.js';
import '@solid-primitives/jsx-tokenizer';

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
