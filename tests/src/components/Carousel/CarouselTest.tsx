import { createMemo, createSignal, createStore, flush, For, Show, onSettled } from "solid-js";
import './carousel.css';
import selectors from "../../../shared/carousel-selectors.json";
import Carousel, { CarouselRef } from "@components/Complex/Carousel/Carousel";

const initialOptions = {
    itemWidth: 50,
    itemGap: 5,
    itemsAlignment: 'center',
    groupItems: false,
    leadingAndTrailingSpaces: true,
    paginationControlsDisabled: false
};
const initialItems = Array.from({ length: 10 }, (_, i) => { return { name: i + 1 + '', selected: false } });
const CarouselTest = () => {
    let carouselRef!: CarouselRef;
    const [carouselOptions, setCarouselOptions] = createStore(JSON.parse(JSON.stringify(initialOptions)));
    const [test, setTest] = createSignal('red');
    const [items, setItems] = createSignal(initialItems);
    const [activePage, setActivePage] = createSignal(0);

    const scenarios = [
        { label: "Change item width", action: () => { setCarouselOptions(o => { o.itemWidth = 20; }) } },
        { label: "Change item gap", action: () => { setCarouselOptions(o => { o.itemGap = 30; }) } },
        { label: "Change item alignment to end", action: () => { setCarouselOptions(o => { o.itemsAlignment = 'end'; }); setCarouselOptions(o => { o.itemGap = 0; }) } },
        { label: "Group items", action: () => { setCarouselOptions(o => { o.groupItems = true; }) } },
        { label: "Add item to front", action: () => { setItems((prev) => [{ name: 'Front', selected: false }, ...prev]) } },
        { label: "Add item to front and select", action: () => { setItems((prev) => [{ name: 'Front selected', selected: true }, ...prev]) } },
        { label: "Add item to back", action: () => { setItems((prev) => [...prev, { name: 'Back', selected: false }]) } },
        { label: "Add item to back and select", action: () => { setItems((prev) => [...prev, { name: 'Back selected', selected: true }]) } },
        { label: "Remove last item", action: () => { setItems((prev) => [...prev.slice(0, prev.length - 1)]) } },
        { label: "Remove first item", action: () => { setItems((prev) => prev.slice(1)) } },
        { label: "Move to next element", action: () => { carouselRef.next() } },
        { label: "Move to prev element", action: () => { carouselRef.prev() } },
        { label: "Move to third element", action: () => { carouselRef.scrollTo(2); } },
        { label: "Remove leading and trailing spaces", action: () => { setCarouselOptions(o => { o.leadingAndTrailingSpaces = false; }); setCarouselOptions(o => { o.itemGap = 0; }) } },
        { label: "Enable custom pagination controls", action: () => { setCarouselOptions(o => { o.paginationControlsDisabled = true; }) } },
        { label: "Add item at middle between first and selected", action: () => { setItems((prev) => [...prev.slice(0, 1), { name: 'Mid', selected: false }, ...prev.slice(1)]) } },
        { label: "Add item at middle between first and selected and select it", action: () => { setItems((prev) => [...prev.slice(0, 1), { name: 'Mid selected', selected: true }, ...prev.slice(1)]) } },
        { label: "Remove second item", action: () => { setItems((prev) => [...prev.slice(0, 1), ...prev.slice(2)]) } },
        { label: "Change styles", action: () => { setTest('blue') } },
    ];

    const reset = () => {
        setCarouselOptions(o => { Object.assign(o, JSON.parse(JSON.stringify(initialOptions))); });
        setItems(initialItems);
        // Apply the new items first: Carousel re-resolves the active item in an effect, which in Solid 2
        // would otherwise run after scrollTo(0) and move the selection back.
        flush();
        carouselRef?.scrollTo(0);
        setTest('red');
    };

    const isReactive = createMemo(() => test() === 'blue');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});
    const reactiveStyleBG = createMemo(() => isReactive() ? { 'background-image': 'linear-gradient(to right bottom,rgb(255, 0, 0), #b9b9b9, #777777, #3b3b3b, #000000)' } : {});

    onSettled(() => {
        document.addEventListener('reset', reset);
        return () => document.removeEventListener('reset', reset);
    });

    return (
        <>
            <div class={selectors.assertionElement}>{`Selected item/page: ${activePage()}`}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <Carousel
                onActivePageChange={(page) => { setActivePage(page) }}
                itemWidth={carouselOptions.itemWidth}
                itemGap={carouselOptions.itemGap}
                itemsAlignment={carouselOptions.itemsAlignment as 'center' | 'start' | 'end'}
                groupItems={carouselOptions.groupItems}
                leadingAndTrailingSpaces={carouselOptions.leadingAndTrailingSpaces}
                ref={carouselRef}
                style={reactiveStyle()}
                class={`${selectors.carousel} ${reactiveClass()}`}>
                <Carousel.Items class={selectors.carouselItems}>
                    <For each={items()}>
                        {(item) => (
                            <Carousel.Item
                                selected={item.selected}
                                style={reactiveStyleBG()}
                                class={`${selectors.carouselItem} ${selectors.carouselItem}-${item.name} ${reactiveClass()}`}
                                style-selected={{ 'border': '3px solid yellow' }}
                                class-selected={selectors.carouselItemSelected}>
                                {`Item ${item.name}`}
                            </Carousel.Item>
                        )}
                    </For>
                </Carousel.Items>
                <Carousel.Pagination>
                    <Carousel.Pagination.Control class={selectors.carouselControl} style={carouselOptions.paginationControlsDisabled ? { display: 'none' } : {}} />
                    <Carousel.Pagination.Item class={selectors.carouselPages} />
                </Carousel.Pagination>
                <Show when={carouselOptions.paginationControlsDisabled}>
                    <Carousel.Prev class={selectors.carouselCustomPrev}>Prev Item</Carousel.Prev>
                    <Carousel.Next class={selectors.carouselCustomNext}>Next Item</Carousel.Next>
                </Show>
            </Carousel>
        </>
    )
}

export default CarouselTest;