import { For, ParentComponent } from "solid-js";
import { TokenComponentProps } from "@components/types/ComponentProps";
import { useTokens } from "@components/utils/tokenComponents";
import { Button, SegmentButton } from "./SegmentButton";

export const SegmentButtons: ParentComponent<TokenComponentProps> = (props) => {
    const ButtonsTokens = useTokens(Button, props.parentChildren);

    return (
        <For each={ButtonsTokens()}>
            {(button) => <SegmentButton button={button} />}
        </For>
    )
}