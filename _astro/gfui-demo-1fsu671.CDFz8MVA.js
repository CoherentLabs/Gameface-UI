import { r as render, c as createComponent, a as createSignal, o as onMount } from './web.e96V-LtU.js';
import { P as Progress } from './Progress.STEbDRTR.js';
import './tokenComponents.hFDI9VqW.js';
import '@solid-primitives/jsx-tokenizer';
import './BaseComponent.BmESB2kC.js';
import 'coherent-gameface-interaction-manager';
import './store.CBj67zxW.js';
import './clamp.BBPiOs3-.js';

const App = () => {
  const [progress, setProgress] = createSignal(0);
  const simulateProgress = (to) => {
    let interval = setInterval(() => setProgress((prev) => {
      if (prev >= to) {
        clearInterval(interval);
        return prev;
      }
      return prev + 1;
    }), 100);
  };
  onMount(() => {
    simulateProgress(100);
  });
  return createComponent(Progress.Bar, {
    get progress() {
      return progress();
    }
  });
};
const _1fsu671 = (root) => render(() => createComponent(App, {}), root);

export { _1fsu671 as default };
