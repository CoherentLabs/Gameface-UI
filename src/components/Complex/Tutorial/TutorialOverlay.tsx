import { Show, useContext } from "solid-js";
import { ComponentProps, TokenComponentProps } from "@components/types/ComponentProps";
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import baseComponent from "@components/BaseComponent/BaseComponent";
import { TutorialContext } from "./Tutorial";
import styles from './Tutorial.module.scss';

export const Overlay = createTokenComponent<ComponentProps>();

/** Transparent full-screen layer that blocks clicks on the page while a step is active. */
const TutorialOverlay = (props: TokenComponentProps) => {
    const ctx = useContext(TutorialContext)!;
    const token = useToken(Overlay, props.parentChildren)() ?? {};

    token.componentClasses = styles.overlay;

    return (
        <Show when={ctx.target()}>
            <div use:baseComponent={token}></div>
        </Show>
    );
};

export default TutorialOverlay;
