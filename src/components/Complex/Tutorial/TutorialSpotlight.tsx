import { createMemo, useContext } from "solid-js";
import { ComponentProps, TokenComponentProps } from "@components/types/ComponentProps";
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import baseComponent from "@components/BaseComponent/BaseComponent";
import { TutorialContext } from "./Tutorial";
import styles from './Tutorial.module.scss';

export const Spotlight = createTokenComponent<Omit<ComponentProps, 'ref' | 'refObject'>>();

/** The highlight frame around the current step's target. The dimming is its box-shadow. */
const TutorialSpotlight = (props: TokenComponentProps) => {
    const ctx = useContext(TutorialContext)!;
    const token = useToken(Spotlight, props.parentChildren)() ?? {};

    const classes = createMemo(() => {
        const classes = [styles.spotlight];
        if (ctx.target()) classes.push(styles['spotlight-visible']);

        return classes.join(" ");
    });

    token.componentClasses = classes;
    token.componentStyles = ctx.highlightStyles;

    return <div use:baseComponent={token}></div>;
};

export default TutorialSpotlight;
