import { ParentComponent, Show, useContext } from "solid-js";
import { Portal } from "solid-js/web";
import { MenuContext } from "../../../views/menu/Menu";

interface ExtraContentProps {
    id: string
}

const ExtraContent: ParentComponent<ExtraContentProps> = (props) => {
    const menuContext = useContext(MenuContext);

    return (
        <Show when={menuContext?.currentOption() === props.id}>
            <Portal mount={document.querySelector('.extra-content')!}>
                {props.children}
            </Portal>
        </Show>
    )
}

export default ExtraContent