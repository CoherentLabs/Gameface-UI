// gfui-demo-seed.ts  (TEMPORARY — for testing only, delete once remark works)
import { demoRegistry, hashDemo } from './gfui-demo-registry';

const testCode = `import { render } from 'solid-js/web';
import Checkbox from '@components/Basic/Checkbox/Checkbox';
export default (root) => render(() => <Checkbox value="v-sync">V-Sync</Checkbox>, root);`;

export const TEST_HASH = hashDemo(testCode);
demoRegistry.set(TEST_HASH, testCode);