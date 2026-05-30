import { LayoutComponentProps } from "../../types/ComponentProps";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";

const InlineTextBlock = (props: LayoutComponentProps) => {
    return <p
        cohinline
        ref={[
            baseComponent(props),
            navigationActions({
                anchor: props.anchor,
                ...props.onAction,
            })
        ]}>
        {props.children}
    </p>
}

export default InlineTextBlock;