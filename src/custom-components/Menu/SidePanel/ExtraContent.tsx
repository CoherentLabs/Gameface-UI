import { ParentComponent, Show, useContext } from "solid-js";
import { Portal } from "solid-js/web";
import { MenuContext } from "../../../views/menu/Menu";
import Tutorial from "@components/Complex/Tutorial/Tutorial";
import { TutorialSteps } from "../../../views/menu/util/tutorialSteps";

interface ExtraContentProps {
    id: string
}

const ExtraContent: ParentComponent<ExtraContentProps> = (props) => {
    const menuContext = useContext(MenuContext);

    return (
        <Show when={menuContext?.currentOption() === props.id}>
            <Portal mount={document.querySelector('.extra-content')!}>
                <Tutorial.Step title={TutorialSteps.InteractiveTwo.title} content={TutorialSteps.InteractiveTwo.content} order={TutorialSteps.InteractiveTwo.order} outset={10}>
                    {props.children}
                </Tutorial.Step>
            </Portal>
        </Show>
    )
}

export default ExtraContent