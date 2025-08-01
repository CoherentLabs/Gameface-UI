import { ComponentProps } from "@components/types/ComponentProps";
import { For, onMount, ParentComponent } from "solid-js";
import styles from './List.module.scss';
import { useTokens } from "@components/utils/tokenComponents";
import { ListItem,  Item, useMarkNested } from "./ListItem";
import LayoutBase from "../LayoutBase";
import { Icon } from "./ListIcon";

export type listType = 'ordered' | 'unordered';

interface ListProps extends ComponentProps {
    type?: listType
}

const List: ParentComponent<ListProps> = (props) => {
    const itemTokens = useTokens(Item, props.children);
    onMount(useMarkNested());
    
    return (
        <LayoutBase class={styles.list} {...props} >
            <For each={itemTokens()}>
                {(item, index) => (
                    <ListItem 
                        item={item} 
                        parentChildren={props.children}
                        type={props.type || 'unordered'}
                        index={index()} />
                )}
            </For>
        </LayoutBase>
    )
}

export default Object.assign(List, { Item, Icon });