import { r as render, c as createComponent, a as createSignal, o as onMount } from './web.ibFHgs_k.js';
import { P as Progress } from './Progress.BjqrgpwP.js';
import './tokenComponents.CSsomKQw.js';
import '@solid-primitives/jsx-tokenizer';
import './BaseComponent.DEyWe7lF.js';
import 'coherent-gameface-interaction-manager';
import './store.DBjQIIM3.js';
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
  return createComponent(Progress.Circle, {
    get progress() {
      return progress();
    },
    get children() {
      return createComponent(Progress.Circle.Text, {
        get children() {
          return `${progress()}%`;
        }
      });
    }
  });
};
const _1yjird1 = (root) => render(() => createComponent(App, {}), root);

export { _1yjird1 as default };
