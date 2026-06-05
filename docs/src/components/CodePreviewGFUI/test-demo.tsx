import { render } from 'solid-js/web';
import Checkbox from '@components/Basic/Checkbox/Checkbox';

export default function mountDemo(root: HTMLElement) {
  return render(
    () => (
      <>
        <Checkbox value="v-sync">V-Sync</Checkbox>
        <Checkbox value="fullscreen" checked>Fullscreen</Checkbox>
      </>
    ),
    root,
  );
}