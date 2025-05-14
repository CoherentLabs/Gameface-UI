import { ParentComponent } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import useBaseComponent from "../../BaseComponent/BaseComponent";

const InlineTextBlock: ParentComponent<ComponentProps> = (props) => {

    const {className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    return <p cohinline 
                ref={props.ref as HTMLParagraphElement}
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props}
                use:forwardAttrs={props} >
                {props.children}
            </p>
}

export default InlineTextBlock;