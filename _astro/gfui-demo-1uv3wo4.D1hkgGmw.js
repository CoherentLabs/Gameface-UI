import { r as render, c as createComponent } from './web.Dte3IpIp.js';
import { S as Scroll } from './Scroll.BhzrsNja.js';
import { T as TextBlock } from './TextBlock.B48l7Oxb.js';
import './LayoutBase.pl_BcpgD.js';
import './BaseComponent.C5rMUBcY.js';
import './store.-dvm-_QW.js';
import './clamp.BBPiOs3-.js';
import './tokenComponents.Vg66oOOL.js';

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
