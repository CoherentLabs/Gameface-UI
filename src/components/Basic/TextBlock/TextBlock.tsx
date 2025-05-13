import { ParentComponent } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import useBaseComponent from "@components/BaseComponent/BaseComponent";

const TextBlock: ParentComponent<ComponentProps> = (props) => {
    const {className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);
    
    return <p ref={props.ref as HTMLParagraphElement}
            class={className()}
            style={inlineStyles()}
            use:forwardEvents={props}
            use:forwardAttrs={props}>
                {props.children}
            </p>
}

export default TextBlock;