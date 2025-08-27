import { Accessor, JSX, ParentComponent, ParentProps, Show, createMemo, onCleanup, onMount, useContext } from "solid-js";
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

    onMount(() => {
        if (!carouselContext.groupItems() && props.item.selected) carouselContext?.setActivePage(props.index());
    })

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

    const itemClasses = createMemo(() => {
        const classes = [styles['carousel-item']];
        if (props.item.class) classes.push(props.item.class as string);
        if (itemSelected()) {
            classes.push(styles['carousel-item-selected']);
            if (props.item["class-selected"]) classes.push(props.item["class-selected"]);
        }
        return classes.join(' ');
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
        <div class={itemClasses()} style={itemStyles()}>
            {props.item.children}
        </div>
    )
}

export default CarouselItem;