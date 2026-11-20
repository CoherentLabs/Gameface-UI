import { createMemo, ParentComponent, Show, useContext } from "solid-js";
import { CarouselContext } from "./Carousel";
import styles from './Carousel.module.scss';
import CarouselArrow from './CarouselArrow.svg?component-solid';
import { ComponentProps } from "@components/types/ComponentProps";
import baseComponent from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";

interface CarouselNextProps extends ComponentProps {
    'class-disabled'?: string;
}

export const CarouselNext: ParentComponent<CarouselNextProps> = (props) => {
    const carouselContext = useContext(CarouselContext);
    if (!carouselContext) {
        console.error('Carousel.Next must be used inside a Carousel component');
        // eslint-disable-next-line solid/components-return-once -- misuse guard: the context is fixed for the component's lifetime, so render nothing
        return null;
    }

    const disabled = createMemo(() => carouselContext.activePage() === carouselContext.pagesCount() - 1);

    return (
        <div
            class={[
                styles['carousel-arrow-next'],
                disabled() && styles['carousel-arrow-disabled'],
                disabled() && props['class-disabled'],
                props.class,
            ]}
            style={props.style}
            ref={[exposeRef(props), baseComponent(props)]}
            // A `click` prop replaces the default action; baseComponent already attaches it as a listener.
            onClick={() => { if (!props.click) carouselContext.next(); }}
        >
            <Show when={props.children} fallback={<CarouselArrow />}>
                {props.children}
            </Show>
        </div>
    )
}
