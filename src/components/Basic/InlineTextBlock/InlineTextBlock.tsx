import { ParentComponent } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import { BaseComponent } from "../../BaseComponent/BaseComponent";

const InlineTextBlock: ParentComponent<ComponentProps> = (props) => {
    const { eventHandlers, ...rest } = BaseComponent(props);

    return <p cohinline {...eventHandlers} ref={props.ref as HTMLParagraphElement} {...rest} >{props.children}</p>
}

export default InlineTextBlock;