import { For, ParentComponent, createEffect, useContext } from "solid-js";
import type { JSX } from "@solidjs/web";
import styles from './Carousel.module.scss';
import { CarouselContext } from "./Carousel";
import { createTokenComponent, useTokens } from "@components/utils/tokenComponents";
import CarouselItem from "./CarouselItem";
import { ComponentProps } from "@components/types/ComponentProps";
import baseComponent from "@components/BaseComponent/BaseComponent";
export interface CarouselItemTokenProps {
    selected?: boolean
    style?: JSX.CSSProperties;
    class?: JSX.ClassValue;
    'style-selected'?: JSX.CSSProperties;
    'class-selected'?: JSX.ClassValue;
}

export const Item = createTokenComponent<CarouselItemTokenProps>(true);

interface CarouselItemsProps extends ComponentProps {
    itemsContainerStyle?: JSX.CSSProperties;
    itemsContainerClass?: JSX.ClassValue;
}

const CarouselItems: ParentComponent<CarouselItemsProps> = (props) => {
    const carouselContext = useContext(CarouselContext);
    if (!carouselContext) {
        console.error('Carousel.Items must be used inside a Carousel component');
        // eslint-disable-next-line solid/components-return-once -- misuse guard: the context is fixed for the component's lifetime, so render nothing
        return null;
    }

    const ItemsTokens = useTokens(Item, () => props.children);

    createEffect(() => ItemsTokens(), (tokens) => {
        carouselContext.setItems(tokens || []);
    });

    return (
        <div
            class={[styles['carousel-items'], props.class]}
            style={props.style}
            ref={[carouselContext.setItemsWrapper, baseComponent(props)]}
        >
            <div
                ref={carouselContext.setItemsContainer}
                class={[styles['carousel-items-container'], props.itemsContainerClass]}
                style={props.itemsContainerStyle}
            >
                <For each={ItemsTokens()}>
                    {(item, index) => <CarouselItem item={item} index={index} />}
                </For>
            </div>
        </div>
    )
}

export default CarouselItems;
