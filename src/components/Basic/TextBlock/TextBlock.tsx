import { ParentComponent } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import baseComponent from "@components/BaseComponent/BaseComponent";

const TextBlock: ParentComponent<ComponentProps> = (props) => {
    return <p
        ref={props.ref as HTMLParagraphElement}
        use:baseComponent={props}
    >
        {props.children}
    </p>
}

export default TextBlock;