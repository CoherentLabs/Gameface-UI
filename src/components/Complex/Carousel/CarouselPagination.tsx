import Pagination, { Item } from "@components/Basic/Pagination/Pagination";
import { ParentComponent, useContext } from "solid-js";
import { CarouselContext } from "./Carousel";
import { Control } from "@components/Basic/Pagination/PaginationControl";
import { ComponentProps } from "@components/types/ComponentProps";

const CarouselPagination: ParentComponent<ComponentProps> = (props) => {
    const carouselContext = useContext(CarouselContext);
    if (!carouselContext) {
        console.error('Carousel.Pagination must be used inside a Carousel component');
        return null;
    }

    return <Pagination
        ref={carouselContext.setPaginationRef}
        pageSize={carouselContext.pagesCount()}
        pageIndex={carouselContext.activePage() + 1}
        onChange={(index) => carouselContext.scrollTo(index - 1)}
        style={props.style}
        class={props.class}
    >
        {props.children}
    </Pagination>
}

export default Object.assign(CarouselPagination, { Item, Control });