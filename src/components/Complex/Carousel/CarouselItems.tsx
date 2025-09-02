import { For, JSX, ParentComponent, Show, createEffect, createMemo, on, onMount, useContext } from "solid-js";
import styles from './Carousel.module.scss';
import { CarouselContext } from "./Carousel";
import { createTokenComponent, useTokens } from "@components/utils/tokenComponents";
import CarouselItem from "./CarouselItem";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { ComponentProps } from "@components/types/ComponentProps";

export interface CarouselItemTokenProps {
    selected?: boolean
    style?: JSX.CSSProperties;
    class?: string;
    'style-selected'?: JSX.CSSProperties;
    'class-selected'?: string;
}

export const Item = createTokenComponent<CarouselItemTokenProps>(true);

interface CarouselItemsProps extends ComponentProps {
    itemsContainerStyle?: JSX.CSSProperties;
    itemsContainerClass?: string;
}

const CarouselItems: ParentComponent<CarouselItemsProps> = (props) => {
    const carouselContext = useContext(CarouselContext);
    if (!carouselContext) {
        console.error('Carousel.Items must be used inside a Carousel component');
        return null;
    }

    const carouselItemsClasses = createMemo(() => {
        const classes = [styles['carousel-items']];
        if (props.class) classes.push(props.class as string);
        return classes.join(' ');
    })

    const carouselItemsContainerClasses = createMemo(() => {
        const classes = [styles['carousel-items-container']];
        if (props.itemsContainerClass) classes.push(props.itemsContainerClass as string);
        return classes.join(' ');
    })

    props.componentClasses = () => carouselItemsClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    const ItemsTokens = useTokens(Item, props.children);

    createEffect(() => {
        carouselContext.setItems(ItemsTokens() || []);
    });

    return (
        <div ref={carouselContext.setItemsWrapper}
            class={className()}
            style={inlineStyles()}
            use:forwardEvents={props}
            use:forwardAttrs={props}
        >
            <div
                ref={carouselContext.setItemsContainer}
                class={carouselItemsContainerClasses()}
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