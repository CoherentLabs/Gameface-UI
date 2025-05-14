import { onMount, ParentComponent } from 'solid-js';
import { ComponentProps } from '../types/ComponentProps';
import useBaseComponent from '@components/BaseComponent/BaseComponent';

const LayoutBase: ParentComponent<ComponentProps> = (props) => {
    let element: HTMLDivElement | undefined;
    const {className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

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
            class={className()}
            style={inlineStyles()}
            use:forwardEvents={props}
            use:forwardAttrs={props}
        >
            {props.children}
        </div>
    );
};

export default LayoutBase;