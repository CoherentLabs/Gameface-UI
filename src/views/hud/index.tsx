import { render } from 'solid-js/web';
import './index.css';
import Hud from './Hud';

const root = document.getElementById('root');

render(() => <Hud />, root!);
