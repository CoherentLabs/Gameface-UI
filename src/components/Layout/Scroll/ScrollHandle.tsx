import { createMemo, JSX, ParentComponent, useContext } from "solid-js";
import styles from './ScrollHandle.module.css';
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import { ScrollContext } from "./Scroll";
import { TokenComponentProps } from "@components/types/ComponentProps";

interface HandleTokenProps {
    style?: JSX.CSSProperties | undefined
    class?: string
}

export const Handle = createTokenComponent<HandleTokenProps>();

export const ScrollHandle: ParentComponent<TokenComponentProps> = (props) => {
    const scrollContext = useContext(ScrollContext);
    const HandleToken = useToken(Handle, props.parentChildren);

    const handleStyles = createMemo(() => {
        const styles = { height: `${scrollContext?.handleHeight()}px`, top: `${scrollContext?.handleTop()}px` };
        const token = HandleToken();
        if (token && token.style) return { ...styles, ...token.style };

        return styles;
    });

    const scrollHandleClasses = createMemo(() => {
        if (HandleToken()?.class) return styles.Handle + ' ' + HandleToken()?.class;

        return styles.Handle;
    });

    return (
        <div
            onMouseDown={scrollContext?.onHandleMouseDown}
            class={scrollHandleClasses()}
            style={handleStyles()}>
            {HandleToken()?.children}
        </div>
    );
};
