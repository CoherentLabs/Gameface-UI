import { ParentComponent } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";

const TextBlock: ParentComponent<ComponentProps> = (props) => {
    return <p
        class={props.class}
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

export default TextBlock;