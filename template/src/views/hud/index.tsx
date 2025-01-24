import { render } from 'solid-js/web';
import './index.css';
import Hud from './Hud';
import mockBindingsModels from '../../binding/mockBindingsModels';
import { mergedModel } from './model/model';

mockBindingsModels(mergedModel, () => {
    const root = document.getElementById('root');

    render(() => <Hud />, root!);
});
