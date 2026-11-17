import { ParentComponent } from 'solid-js';
import { ComponentProps } from '../types/ComponentProps';
import baseComponent, { navigationActions } from '@components/BaseComponent/BaseComponent';

const LayoutBase: ParentComponent<ComponentProps> = (props) => {
    const navConfig = () => {
        if (!props.onAction && !props.anchor) return undefined;
        return {
            anchor: props.anchor,
            ...props.onAction
        };
    };

    const forwardRef = (el: HTMLDivElement) => {
        if (!props.ref) return;

        if (props.refObject) {
            (props.ref as (arg: any) => void)({
                ...props.refObject,
                element: el,
            });
        } else {
            (props.ref as (arg: any) => void)(el);
        }
    };

    return (
        <div ref={[forwardRef, baseComponent(props), navigationActions(navConfig())]}>
            {props.children}
        </div>
    );
};

export default LayoutBase;
