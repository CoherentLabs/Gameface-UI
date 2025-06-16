import { render } from 'solid-js/web';
import './index.css';
import Playground from './Playground';

const root = document.getElementById('root');

render(() => <Playground />, root!);
