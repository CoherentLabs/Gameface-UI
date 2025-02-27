import { ParentComponent } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import { BaseComponent } from "../../BaseComponent/BaseComponent";

const InlineTextBlock: ParentComponent<ComponentProps> = (props) => {

    return <p cohinline 
                ref={props.ref as HTMLParagraphElement}
                {...BaseComponent(props).eventHandlers} 
                class={BaseComponent(props).className}
                style={BaseComponent(props).style}>
                {props.children}
            </p>
}

export default InlineTextBlock;