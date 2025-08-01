import { createContext, createSignal, ParentComponent, ParentProps, Show, useContext } from "solid-js";
import LayoutBase from "../LayoutBase";
import ListIcon from "./ListIcon";
import styles from './List.module.scss';
import { createTokenComponent, TokenBase } from "@components/utils/tokenComponents";
import { TokenComponentProps } from "@components/types/ComponentProps";
import { listType } from "./List";

interface ListItemProps extends ParentProps, TokenBase {}

interface ListItemComponentProps extends TokenComponentProps {
    item: ListItemProps
    index: number
    type: listType
}

export type MarkNested = () => void;
export const NestedListContext = createContext<MarkNested>(() => {});
export const useMarkNested = (): MarkNested => useContext(NestedListContext);
export const Item = createTokenComponent<ListItemProps>()

export const ListItem: ParentComponent<ListItemComponentProps> = (props) => {
    const [isNested, setIsNested] = createSignal(false);
    return (
        <NestedListContext.Provider value={() => setIsNested(true)}>
            <LayoutBase 
                class={`${styles['list-item']} ${isNested() ? styles['list-item-nested'] : ''} ${props.item.class ?? ''}`}
                style={props.item.style}
                {...props}>
                <ListIcon 
                    parentChildren={props.parentChildren} 
                    isNested={isNested}
                    index={props.type === 'ordered' ? (props.index + 1) : 0} />
                {props.item?.children}
            </LayoutBase>
        </NestedListContext.Provider>
    );
}