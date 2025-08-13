import { Accessor, createContext, createSignal, JSX, ParentComponent, ParentProps, Show } from "solid-js";
import LayoutBase from "../LayoutBase";
import ListIcon from "./ListIcon";
import styles from './List.module.scss';
import { createTokenComponent, TokenBase } from "@components/utils/tokenComponents";
import { TokenComponentProps } from "@components/types/ComponentProps";

interface ListItemProps extends ParentProps, TokenBase {}

interface ListItemComponentProps extends TokenComponentProps {
    item: ListItemProps
    index: number
}

export interface nestedListCtx {
    mountNested: (list: JSX.Element) => void,
    nestedList: Accessor<JSX.Element>
}
export const NestedListContext = createContext<nestedListCtx>();
export const Item = createTokenComponent<ListItemProps>()

export const ListItem: ParentComponent<ListItemComponentProps> = (props) => {
    const [nestedList, setNestedList] = createSignal<JSX.Element>();
    const mountNested = (list: JSX.Element) => setNestedList(list);

    const ItemHeader = () => (
        <>
            <ListIcon
                parentChildren={props.item.children}
                isNested={nestedList() ? true : false}
                index={props.index}
            />
            {props.item.children}
        </>
    );

    return (
        <NestedListContext.Provider value={{mountNested, nestedList}}>
            <LayoutBase 
                class={`${styles['list-item']} ${nestedList() ? styles['list-item-nested'] : ''} ${props.item.class ?? ''}`}
                style={props.item.style}
                {...props}>

                <Show when={nestedList()} fallback={<ItemHeader />}>
                    <div class={styles['list-item']}>
                        <ItemHeader />
                    </div>
                    {nestedList()}
                </Show>

            </LayoutBase>
        </NestedListContext.Provider>
    );
}