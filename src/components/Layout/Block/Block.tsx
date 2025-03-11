import { ParentComponent } from "solid-js";
import { ComponentBaseProps } from "../../types/ComponentProps";
import LayoutBase from "../LayoutBase";

const Block: ParentComponent<ComponentBaseProps> = (props) => {
    return <LayoutBase {...props}/>
}

export default Block;