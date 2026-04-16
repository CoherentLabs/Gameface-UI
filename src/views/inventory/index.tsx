import { render } from 'solid-js/web';
import Inventory from './Inventory';
import './index.css';

const root = document.getElementById('root');

render(() => <Inventory />, root!);