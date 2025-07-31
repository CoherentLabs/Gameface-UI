import { Accessor, createMemo, ParentComponent, Show } from "solid-js";
import { TokenComponentProps } from "../../types/ComponentProps";
import styles from './List.module.scss';
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";

interface ListIconComponent extends TokenComponentProps, TokenBase {
    index: number,
    isNested: Accessor<boolean>,
}

export const Icon = createTokenComponent<TokenBase>()

const ListIcon: ParentComponent<ListIconComponent> = (props) => {
    const IconToken = useToken(Icon, props.parentChildren)
    const isOrdered = createMemo(() => props.index > 0);

    const IconClasses = createMemo(() => {
        const classes = [styles.icon, isOrdered() ? styles['icon-number'] : styles['icon-dot']];

        classes.push(IconToken()?.class ?? "");

        return classes.join(' ');
    })

    return (
        <>
            <Show when={IconToken()?.children && !props.isNested()}>
                <div style={IconToken()?.style} class={`${IconToken()?.class} ${styles.icon}`}>
                    {IconToken()?.children}
                </div>
            </Show>
            <Show when={!IconToken()?.children && !props.isNested()}>
                <div style={IconToken()?.style} class={IconClasses()}>
                    {isOrdered() && (props.index + '.')}
                </div>
            </Show>
        </>
    );
}

export default ListIcon;