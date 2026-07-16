import { r as render, c as createComponent } from './web.ibFHgs_k.js';
import { S as Scroll } from './Scroll.Bf4A-gOa.js';
import { T as TextBlock } from './TextBlock.CHMWmO0z.js';
import './LayoutBase.DEk-c953.js';
import './BaseComponent.DEyWe7lF.js';
import 'coherent-gameface-interaction-manager';
import './store.DBjQIIM3.js';
import './clamp.BBPiOs3-.js';
import './tokenComponents.CSsomKQw.js';
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
