import { createMemo, ParentComponent, Show, useContext } from "solid-js";
import { JSX } from "@solidjs/web";
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
    const IconToken = useToken(Icon, () => props.parentChildren)
    const listContext = useContext(ListContext);

    const IconClasses = () => [
        styles.icon,
        listContext?.bulletBgUrl() ? styles[`icon-custom`] : styles[`icon-${listContext?.bulletType()}`],
        listContext?.bulletClass(),
        IconToken()?.class,
    ];

    const IconStyle = createMemo(() => {
        const base = IconToken()?.style ?? {};
        const bg = listContext?.bulletBgUrl();
        const url = typeof bg === 'string' ? bg : bg?.src;
        if (!url || IconToken()?.children) return base;

        return {
            ...base,
            'background-image': `url("${url}")`,
        } as JSX.CSSProperties;
    });

    return (
        <>
            <Show when={IconToken()?.children}>
                <div style={IconStyle()} class={[IconToken()?.class, styles.icon, listContext?.bulletClass()]}>
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