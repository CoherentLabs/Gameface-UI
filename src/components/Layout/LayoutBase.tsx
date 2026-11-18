import { ParentComponent } from 'solid-js';
import { ComponentProps } from '../types/ComponentProps';
import baseComponent, { navigationActions } from '@components/BaseComponent/BaseComponent';
import exposeRef from '@components/utils/exposeRef';

const LayoutBase: ParentComponent<ComponentProps> = (props) => {
    const navConfig = () => {
        if (!props.onAction && !props.anchor) return undefined;
        return {
            anchor: props.anchor,
            ...props.onAction
        };
    };

    return (
        <div class={props.class} style={props.style} ref={[exposeRef(props, () => props.refObject), baseComponent(props), navigationActions(navConfig())]}>
            {props.children}
        </div>
    );
};

export default LayoutBase;
