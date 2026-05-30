import { render } from '@solidjs/web';
import Inventory from './Inventory';
import './index.css';

const root = document.getElementById('root');

render(() => <Inventory />, root!);