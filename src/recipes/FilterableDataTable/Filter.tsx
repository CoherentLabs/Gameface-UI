import Flex from "@components/Layout/Flex/Flex";
import { Component, createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";
import { PlayerPosition, POSITIONS } from "./types";
import styles from './FilterableDataTable.module.scss';
import filterIcon from './assets/filter.svg';
import BackgroundImage from "@components/Media/BackgroundImage/BackgroundImage";
import Toggle from "./Toggle/Toggle";
import Dropdown from "./Dropdown/Dropdown";
import Slider from "./Slider/Slider";
import { numericStats } from "./store/playersStore";
import { DEFAULT_FILTERS, isDefaultFilters, PlayerFilters } from "./utils/filters";
import TwoHandleSlider from "./TwoHandleSlider/TwoHandleSlider";

interface FilterProps {
    setAppliedFilters: (filters: PlayerFilters) => void;
}

// Stops the mousedown from bubbling out of the panel while dragging a slider
// inside it (mirrors the pattern in components/Feedback/Modal for the same reason).
const captureMouse = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
}

const Filter: Component<FilterProps> = (props) => {
    const [open, setOpen] = createSignal(false);
    const [hasChanged, setHasChanged] = createSignal(false);
    const [hasApplied, setHasApplied] = createSignal(false);
    const [draft, setDraft] = createStore<PlayerFilters>({ ...DEFAULT_FILTERS });

    const toggle = () => setOpen(prev => !prev);

    const updateFilter = <K extends keyof PlayerFilters>(key: K, value: PlayerFilters[K]) => {
        setDraft(key as any, value as any);
        setHasChanged(!isDefaultFilters(draft));
    };

    const setNumericFilter = (name: 'condition' | 'appearances' | 'goals' | 'assists', v: number) =>
        updateFilter(name, v === numericStats()[name].min ? undefined : v);

    const setAgeFilter = (min: number, max: number) => {
        updateFilter(
            'age', 
            min === numericStats().age.min && max === numericStats().age.max ? undefined : { min, max }
        );
    }

    const setPositionFilter = (pos: PlayerPosition, on: boolean) =>
        updateFilter('position', on ? [...draft.position, pos] : draft.position.filter(p => p !== pos));

    const setNationalityFilter = (countries: string[]) =>
        updateFilter('nationality', countries);

    const snapshot = (): PlayerFilters => ({
        ...draft,
        position: [...draft.position],
        nationality: [...draft.nationality],
        age: draft.age ? { ...draft.age } : undefined,
    });

    const applyFilters = () => {
        props.setAppliedFilters(snapshot());
        setOpen(false);
        setHasChanged(false);
        setHasApplied(!isDefaultFilters(draft));
    }

    const resetFilters = () => {
        if (!hasApplied() && !hasChanged()) return;

        setDraft({ ...DEFAULT_FILTERS });
        props.setAppliedFilters({ ...DEFAULT_FILTERS });
        setHasChanged(false);
        setHasApplied(false);
    }

    return (
        <Flex class={styles.filter} >

            {/* Trigger */}
            <Flex class={styles['filter-trigger']} click={toggle} align-items="center" gap="0.5rem">
                <BackgroundImage src={filterIcon} class={styles['filter-trigger-icon']} options={{ size: 'contain', position: 'center' }} />
                <div>Filter</div>
            </Flex>

            {/* Panel */}
            <div
                onMouseDown={captureMouse}
                class={`${styles['filter-panel']} ${open() ? styles['filter-panel-open'] : ''}`}>
                <Flex direction="column" class={styles['filter-row']}>
                    <div class={styles['filter-row-heading']}>Position</div>
                    <Flex direction="row" justify-content="space-between" align-items="center" >
                        <For each={POSITIONS}>{(pos) => (
                            <Toggle
                                label={pos}
                                checked={draft.position.includes(pos)}
                                onChange={(v) => setPositionFilter(pos, v)} />
                        )}</For>
                    </Flex>
                </Flex>

                <div class={styles['filter-row']}>
                    <div class={styles['table-nav-filter-panel-row-heading']}>Nationality</div>
                    <Dropdown value={draft.nationality} onChange={setNationalityFilter} />
                </div>

                <div class={styles['filter-row']}>
                    <TwoHandleSlider 
                        onChange={(value) => setAgeFilter(value.start, value.end)}
                        label="Age"
                        min={numericStats().age.min}
                        max={numericStats().age.max}
                         value={
                            draft.age
                                ? { start: draft.age.min, end: draft.age.max }
                                : { start: numericStats().age.min, end: numericStats().age.max }
                        }
                    />
                </div>

                <div class={styles['filter-row']}>
                    <Slider
                        label="Min Cond."
                        min={numericStats().condition.min}
                        max={numericStats().condition.max}
                        value={draft.condition ?? numericStats().condition.min}
                        onChange={(value) => setNumericFilter('condition', value)} />
                </div>

                <div class={styles['filter-row']}>
                    <Slider
                        label="Min Apps."
                        min={numericStats().appearances.min}
                        max={numericStats().appearances.max}
                        value={draft.appearances ?? numericStats().appearances.min}
                        onChange={(value) => setNumericFilter('appearances', value)} />
                </div>

                <div class={styles['filter-row']}>
                    <Slider
                        label="Min Goals"
                        min={numericStats().goals.min}
                        max={numericStats().goals.max}
                        value={draft.goals ?? numericStats().goals.min}
                        onChange={(value) => setNumericFilter('goals', value)} />
                </div>

                <div class={styles['filter-row']}>
                    <Slider
                        label="Min Assists"
                        min={numericStats().assists.min}
                        max={numericStats().assists.max}
                        value={draft.assists ?? numericStats().assists.min}
                        onChange={(value) => setNumericFilter('assists', value)} />
                </div>

                <div class={styles['filter-row']}>
                    <Flex direction="row" justify-content="space-between" align-items="center" gap="0.5rem">
                        <div
                            class={`${styles['panel-btn']} ${!hasChanged() ? styles['panel-btn-disabled'] : ''}`}
                            onClick={applyFilters}>Apply Filters</div>
                        <div
                            class={`${styles['panel-btn']} ${styles['panel-btn-danger']} ${!(hasApplied() || hasChanged()) ? styles['panel-btn-disabled'] : ''}`}
                            onClick={resetFilters}>Reset</div>
                    </Flex>
                </div>
            </div>
        </Flex>
    )
}

export default Filter;