import { render } from 'solid-js/web';
import './index.css';
import Menu from './Menu';
import mockBindingsModels from '../../binding/mockBindingsModels';
import models from './model/model.json';

mockBindingsModels(models, () => {
    const root = document.getElementById('root');

    render(() => <Menu />, root!);
}, false);
