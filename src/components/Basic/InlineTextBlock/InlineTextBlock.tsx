import { ParentComponent } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";

const InlineTextBlock: ParentComponent<ComponentProps> = (props) => {
    return <p cohinline
        class={props.class}
        style={props.style}
        ref={[
            exposeRef(props),
            baseComponent(props),
            navigationActions({
                anchor: props.anchor,
                ...props.onAction,
            }),
        ]}
    >
        {props.children}
    </p>
}

export default InlineTextBlock;
