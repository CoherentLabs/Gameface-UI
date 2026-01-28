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

    const navConfig = () => {
        if (!props.onAction && !props.anchor) return undefined;
        return {
            anchor: props.anchor,
            ...props.onAction
        };
    };

    return (
        <div
            ref={element}
            class={className()}
            style={inlineStyles()}
            use:forwardEvents={props}
            use:forwardAttrs={props}
            use:navigationActions={navConfig()}
        >
            {props.children}
        </div>
    );
};

export default LayoutBase;