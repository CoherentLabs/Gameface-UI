import { r as render, c as createComponent } from './web.Dte3IpIp.js';
import { A as Absolute } from './Absolute.7ijotCdu.js';
import { B as Block } from './Block.CblygUPM.js';
import './LayoutBase.pl_BcpgD.js';
import './BaseComponent.C5rMUBcY.js';
import './store.-dvm-_QW.js';

const _1psse4b = (root) => render(() => createComponent(Absolute, {
  top: "50px",
  right: "50px",
  get children() {
    return createComponent(Block, {
      children: "Content with top and right offset by 50px"
    });
  }
}), root);

export { _1psse4b as default };
