import { ParentComponent } from 'solid-js';
import { ComponentProps } from '../types/ComponentProps';
import baseComponent, { navigationActions } from '@components/BaseComponent/BaseComponent';

const LayoutBase: ParentComponent<ComponentProps<any>> = (props) => {
    const navConfig = () => {
        if (!props.onAction && !props.anchor) return undefined;
        return {
            anchor: props.anchor,
            ...props.onAction
        };
    };

    return (
        <div ref={[baseComponent(props), navigationActions(navConfig())]} >
            {props.children}
        </div>
    );
};

export default LayoutBase;