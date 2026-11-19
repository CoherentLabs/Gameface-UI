import { Accessor, ParentComponent, ParentProps, createMemo, useContext } from "solid-js";
import type { JSX } from "@solidjs/web";
import styles from './Carousel.module.scss';
import { CarouselContext } from "./Carousel";
import { CarouselItemTokenProps } from "./CarouselItems";

interface CarouselItemProps {
    item: ParentProps<CarouselItemTokenProps>
    index: Accessor<number>;
}

const CarouselItem: ParentComponent<CarouselItemProps> = (props) => {
    const carouselContext = useContext(CarouselContext);

    if (!carouselContext) {
        console.error('Carousel.Item must be used inside a Carousel component');
        return null;
    }

    const width = createMemo(() => {
        return carouselContext?.itemWidth();
    });

    const gap = createMemo(() => {
        return carouselContext?.itemGap() / 2;
    });

    const itemSelected = createMemo(() => {
        if (carouselContext.groupItems()) return false;
        return carouselContext.activePage() === props.index()
    });

    const itemStyles = createMemo(() => {
        const styles: JSX.CSSProperties = {
            width: width() + '%',
            "margin-right": gap() + '%',
            "margin-left": gap() + '%'
        };
        if (props.item.style) {
            Object.assign(styles, props.item.style);
        }
        if (itemSelected() && props.item['style-selected']) {
            Object.assign(styles, props.item['style-selected']);
        }
        return styles;
    });

    return (
        <div
            class={[
                styles['carousel-item'],
                props.item.class,
                itemSelected() && styles['carousel-item-selected'],
                itemSelected() && props.item['class-selected'],
            ]}
            style={itemStyles()}>
            {props.item.children}
        </div>
    )
}

export default CarouselItem;
