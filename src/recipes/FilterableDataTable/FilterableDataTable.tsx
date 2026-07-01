import './fonts.css';
import { Component, createEffect, createMemo, createSignal, Index, on } from "solid-js";
import { PaginationRef } from "@components/Basic/Pagination/Pagination";
import Flex from '@components/Layout/Flex/Flex';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import InlineTextBlock from "@components/Basic/InlineTextBlock/InlineTextBlock";
import styles from './FilterableDataTable.module.scss';
import { playersState } from "./store/playersStore";
import Filter from "./Filter";
import Pagination from "./Pagination/Pagination";
import Search from "./Search/Search";
import { DEFAULT_FILTERS } from "./utils/filters";

const PLAYERS_PER_PAGE = 8;
const INITIAL_PAGE = 1;
const FilterableDataTable: Component = () => {
    const [currentPage, setCurrentPage] = createSignal(INITIAL_PAGE);
    const [appliedFilters, setAppliedFilters] = createSignal(DEFAULT_FILTERS);
    const [inputValue, setInputValue] = createSignal('');
    let paginationRef: PaginationRef | undefined;

    // Keeps page state in sync with the filters.
    createEffect(on([appliedFilters, inputValue], () => {
        paginationRef?.changeIndex(1);
    }, { defer: true }));

    const filteredPlayers = createMemo(() => {
        const filters = appliedFilters();
        const searchFilter = inputValue().toLowerCase().trim();

        return playersState.filter(player =>
            (searchFilter === '' || player.name.toLowerCase().includes(searchFilter)) &&
            (filters.position.length === 0 || filters.position.includes(player.position)) &&
            (filters.nationality.length === 0 || filters.nationality.includes(player.nationality)) &&
            (filters.age === undefined || (player.age >= filters.age.min && player.age <= filters.age.max)) &&
            (filters.condition === undefined || player.condition >= filters.condition) &&
            (filters.appearances === undefined || player.appearances >= filters.appearances) &&
            (filters.goals === undefined || player.goals >= filters.goals) &&
            (filters.assists === undefined || player.assists >= filters.assists)
        )
    })

    const pageCount = createMemo(() => Math.ceil(filteredPlayers().length / PLAYERS_PER_PAGE));
    const visibleItems = createMemo(() => {
        const startIndex = (currentPage() - 1) * PLAYERS_PER_PAGE;

        return filteredPlayers().slice(startIndex, startIndex + PLAYERS_PER_PAGE);
    })

    return (
        <Flex direction='column' class={styles.table}>
            <Flex justify-content='space-between' align-items='center' class={styles.nav}>
                <InlineTextBlock class={styles['nav-heading']}>
                    <span class={styles['nav-heading-highlight']}>Squad Roster</span>: Active UNIT List
                </InlineTextBlock>
                <Flex style={{flex: 1}} gap='0.5vmax' justify-content='end' align-items='stretch'>
                    <Search inputValue={inputValue()} onChange={setInputValue} />
                    <Filter setAppliedFilters={setAppliedFilters} />
                </Flex>
            </Flex>

            <TableHeader />
            <div class={styles.body}>
                <Index each={visibleItems()}>{(player, index) => (
                    <TableRow data={player} index={index} />
                )}</Index>
            </div>

            <div class={styles.footer}>
                <Pagination
                    ref={(ref) => (paginationRef = ref)}
                    currentPage={INITIAL_PAGE}
                    onChange={setCurrentPage}
                    size={pageCount()} />
                <InlineTextBlock class={styles['footer-total']}>
                    <span class={styles['footer-total-highlight']}>TOTAL PLAYERS: </span>
                    {playersState.length}
                </InlineTextBlock>
            </div>
        </Flex>
    )
}

export default FilterableDataTable;
