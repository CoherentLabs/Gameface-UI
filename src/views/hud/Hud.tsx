import ChipMultiSelect from '@recipes/ChipMultiSelect/ChipMultiSelect';
import styles from './Hud.module.scss';
import { createSignal } from 'solid-js';
import FilterableDataTable from '@recipes/FilterableDataTable/FilterableDataTable';

const Hud = () => {

    const [selectedCountries, setSelectedCountries] = createSignal<string[]>([]);

    return (
        <div class={styles.Hud} style={{padding: '3rem'}}>
            {/* <div style={{width: '15rem'}}>
                <ChipMultiSelect value={selectedCountries()} onChange={setSelectedCountries} />
            </div> */}
            <FilterableDataTable />
        </div>
    );
};

export default Hud;
