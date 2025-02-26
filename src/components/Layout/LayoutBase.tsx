import { ParentComponent, createEffect, onMount, splitProps } from 'solid-js';
import { ComponentProps } from '../types/ComponentProps';
import { BaseComponent } from '../BaseComponent/BaseComponent';

const LayoutBase: ParentComponent<ComponentProps> = (props) => {
    let element: HTMLDivElement | undefined;

    onMount(() => {
        if (props.ref && element) {
            (props.ref as (ref: any) => void)({
                ...props.refObject,
                element,
            });
        }
    });

    return (
        <div
            ref={element}
            {...BaseComponent(props).eventHandlers}
            class={BaseComponent(props).className}
            style={BaseComponent(props).style}
        >
            {props.children}
        </div>
    );
};

export default LayoutBase;
