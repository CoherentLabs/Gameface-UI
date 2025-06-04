import { For, ParentComponent } from "solid-js";
import { TokenComponentProps } from "@components/types/ComponentProps";
import { useTokens } from "@components/utils/tokenComponents";
import { Button, RadioButton } from "./RadioButton";

export const RadioButtons: ParentComponent<TokenComponentProps> = (props) => {
    const ButtonsTokens = useTokens(Button, props.parentChildren);

    return (
        <For each={ButtonsTokens()}>
            {(button) => <RadioButton button={button} />}
        </For>
    )
}