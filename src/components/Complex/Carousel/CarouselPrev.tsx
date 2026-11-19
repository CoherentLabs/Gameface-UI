import { createMemo, ParentComponent, Show, useContext } from "solid-js";
import { CarouselContext } from "./Carousel";
import styles from './Carousel.module.scss';
import CarouselArrow from './CarouselArrow.svg?component-solid';
import { ComponentProps } from "@components/types/ComponentProps";
import baseComponent from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";
interface CarouselPrevProps extends ComponentProps {
    'class-disabled'?: string;
}

export const CarouselPrev: ParentComponent<CarouselPrevProps> = (props) => {
    const carouselContext = useContext(CarouselContext);
    if (!carouselContext) {
        console.error('Carousel.Prev must be used inside a Carousel component');
        return null;
    }

    const disabled = createMemo(() => carouselContext.activePage() === 0);

    return (
        <div
            class={[
                styles['carousel-arrow-prev'],
                disabled() && styles['carousel-arrow-disabled'],
                disabled() && props['class-disabled'],
                props.class,
            ]}
            style={props.style}
            ref={[exposeRef(props), baseComponent(props)]}
            // A `click` prop replaces the default action; baseComponent already attaches it as a listener.
            onClick={() => { if (!props.click) carouselContext.prev(); }}
        >
            <Show when={props.children} fallback={<CarouselArrow />}>
                {props.children}
            </Show>
        </div>
    )
}
