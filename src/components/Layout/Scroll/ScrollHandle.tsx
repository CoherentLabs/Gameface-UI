import { createMemo, ParentComponent, useContext, ParentProps } from "solid-js";
import styles from './Scroll.module.scss';
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import { forwardAttrs } from "@components/BaseComponent/BaseComponent";
import { ScrollContext } from "./Scroll";
import { TokenComponentProps } from "@components/types/ComponentProps";

export interface HandleTokenProps extends ParentProps<TokenBase> { }

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
        if (HandleToken()?.class) return styles.handle + ' ' + HandleToken()?.class;

        return styles.handle;
    });

    return (
        <div
            onMouseDown={scrollContext?.onHandleMouseDown}
            class={scrollHandleClasses()}
            style={handleStyles()}
            use:forwardAttrs={HandleToken()}>
            {HandleToken()?.children}
        </div>
    );
};
