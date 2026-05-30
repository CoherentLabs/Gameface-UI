import { render } from '@solidjs/web';
import './index.css';
import Migrate from './Migrate';

const root = document.getElementById('root');

render(() => <Migrate />, root!);