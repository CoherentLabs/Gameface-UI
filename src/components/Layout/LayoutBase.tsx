import { onMount, ParentComponent } from 'solid-js';
import { ComponentProps } from '../types/ComponentProps';
import useBaseComponent from '@components/BaseComponent/BaseComponent';

const LayoutBase: ParentComponent<ComponentProps> = (props) => {
    let element: HTMLDivElement | undefined;
    const {className, inlineStyles, forwardEvents, forwardAttrs, navigationActions } = useBaseComponent(props);

    onMount(() => {
        if (!props.ref || !element) return;

        if (props.refObject) {
            (props.ref as (arg: any) => void)({
                ...props.refObject,
                element,
            });
        } else {
            (props.ref as (arg: any) => void)(element);
        }
    });

    return (
        <div
            ref={element}
            class={className()}
            style={inlineStyles()}
            use:forwardEvents={props}
            use:forwardAttrs={props}
            use:navigationActions={{
                anchor: props.anchor,
                ...props.onAction,
            }}
        >
            {props.children}
        </div>
    );
};

export default LayoutBase;