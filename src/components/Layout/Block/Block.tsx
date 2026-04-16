import { ParentComponent } from "solid-js";
import { ComponentBaseProps } from "../../types/ComponentProps";
import LayoutBase from "../LayoutBase";

interface BlockProps extends ComponentBaseProps {
    width?: string,
    height?: string,
}

const Block: ParentComponent<BlockProps> = (props) => {
    return <LayoutBase {...props} componentStyles={{
        width: props.width ?? undefined,
        height: props.height ?? undefined
    }}/>
}

export default Block;