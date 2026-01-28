import { createMemo, ParentComponent, Show, useContext } from "solid-js";
import { CarouselContext } from "./Carousel";
import styles from './Carousel.module.scss';
import CarouselArrow from './CarouselArrow.svg?component-solid';
import { ComponentProps } from "@components/types/ComponentProps";
import baseComponent from "@components/BaseComponent/BaseComponent";

interface CarouselNextProps extends ComponentProps {
    'class-disabled'?: string;
}

export const CarouselNext: ParentComponent<CarouselNextProps> = (props) => {
    const carouselContext = useContext(CarouselContext);
    if (!carouselContext) {
        console.error('Carousel.Next must be used inside a Carousel component');
        return null;
    }

    const nextArrowClasses = createMemo(() => {
        const classes = [styles['carousel-arrow-next']];
        if (carouselContext.activePage() === carouselContext.pagesCount() - 1) {
            classes.push(styles['carousel-arrow-disabled']);
            if (props['class-disabled']) classes.push(props['class-disabled']);
        }
        return classes.join(' ');
    })

    props.componentClasses = () => nextArrowClasses();

    return (
        <div
            use:baseComponent={props}
            onClick={(event) => props.click ? props.click(event) : carouselContext.next()}
        >
            <Show when={props.children}>
                {props.children}
            </Show>
            <Show when={!props.children}>
                <CarouselArrow />
            </Show>
        </div>
    )
}
