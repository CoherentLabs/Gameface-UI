import { ParentComponent } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import { BaseComponent } from "../../BaseComponent/BaseComponent";

const TextBlock: ParentComponent<ComponentProps> = (props) => {
    const { eventHandlers, ...rest } = BaseComponent(props);

    return <p {...eventHandlers} ref={props.ref as HTMLParagraphElement} {...rest} >{props.children}</p>
}

export default TextBlock;