import { ParentComponent } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";

const InlineTextBlock: ParentComponent<ComponentProps> = (props) => {
    return <p cohinline
        ref={props.ref as HTMLParagraphElement}
        use:baseComponent={props}
        use:navigationActions={{
            anchor: props.anchor,
            ...props.onAction,
        }}
    >
        {props.children}
    </p>
}

export default InlineTextBlock;