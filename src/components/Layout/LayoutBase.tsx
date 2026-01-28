import { ParentComponent } from 'solid-js';
import { ComponentProps } from '../types/ComponentProps';
import baseComponent from '@components/BaseComponent/BaseComponent';

const LayoutBase: ParentComponent<ComponentProps> = (props) => {
    return (
        <div
            ref={(el) => {
                if (props.ref) {
                    (props.ref as (ref: any) => void)({
                        ...props.refObject,
                        element: el
                    });
                }
            }}
            use:baseComponent={props}
        >
            {props.children}
        </div>
    );
};

export default LayoutBase;