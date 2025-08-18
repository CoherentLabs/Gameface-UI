import { createMemo, JSX, ParentComponent, Show, useContext } from "solid-js";
import { TokenComponentProps } from "../../types/ComponentProps";
import styles from './List.module.scss';
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import { ListContext } from "./List";

interface ListIconComponent extends TokenComponentProps, TokenBase {
    isNested: boolean,
    index: number,
}

export const Icon = createTokenComponent<TokenBase>()
const ListIcon: ParentComponent<ListIconComponent> = (props) => {
    const IconToken = useToken(Icon, props.parentChildren)
    const listContext = useContext(ListContext);

    const IconClasses = createMemo(() => {
        const classes = [styles.icon];

        classes.push(listContext?.bulletBgUrl() 
            ? styles[`icon-custom`] 
            : styles[`icon-${listContext?.bulletType()}`])

        classes.push(listContext?.bulletClass() ?? "")
        classes.push(IconToken()?.class ?? "");

        return classes.join(' ');
    })

    const IconStyle = createMemo(() => {
        const base = IconToken()?.style ?? {};
        const url = listContext?.bulletBgUrl();
        if (!url || IconToken()?.children) return base;

        return {
            ...base,
            'background-image': `url("${url}")`,
        } as JSX.CSSProperties;
    });

    return (
        <>
            <Show when={IconToken()?.children}>
                <div style={IconStyle()} class={`${IconToken()?.class ?? ""} ${styles.icon} ${listContext?.bulletClass() ?? ''}`}>
                    {IconToken()?.children}
                </div>
            </Show>
            <Show when={!IconToken()?.children}>
                <div style={IconStyle()} class={IconClasses()}>
                    {listContext?.isOrdered() && ((props.index + 1) + '.')}
                </div>
            </Show>
        </>
    );
}

export default ListIcon;