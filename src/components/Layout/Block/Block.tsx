import { ParentComponent } from "solid-js";
import { ComponentBaseProps } from "../../types/ComponentProps";
import LayoutBase from "../LayoutBase";

interface BlockProps extends ComponentBaseProps {
    width?: string,
    height?: string,
}

const Block: ParentComponent<BlockProps> = (props) => {
    return <LayoutBase {...props} style={{
        width: props.width ?? undefined,
        height: props.height ?? undefined,
        ...props.style
    }}/>
}

export default Block;