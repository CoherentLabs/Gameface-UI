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

    return (
        <div
            ref={(el) => {
                if (!props.ref) return;
                
                if (props.refObject) {
                    (props.ref as (arg: any) => void)({
                        ...props.refObject,
                        element: el,
                    });
                } else {
                    (props.ref as (arg: any) => void)(el);
                }
            }}
            use:baseComponent={props}
            use:navigationActions={navConfig()}
        >
            {props.children}
        </div>
    );
};

export default LayoutBase;