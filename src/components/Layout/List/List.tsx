import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createContext, createMemo, For, onMount, ParentComponent, useContext } from "solid-js";
import styles from './List.module.scss';
import { useTokens } from "@components/utils/tokenComponents";
import { ListItem,  Item, NestedListContext } from "./ListItem";
import LayoutBase from "../LayoutBase";
import { Icon } from "./ListIcon";

const PREDEFINED_TYPES = ['disc', 'circle', 'square', 'number', 'none'] as const
type listType = 'ordered' | 'unordered';
type bulletType = typeof PREDEFINED_TYPES[number] | (string & {}) | ImageMetadata

interface ListProps extends ComponentProps {
    type?: listType,
    'bullet-type'?: bulletType,
    'bullet-class'?: string,
}

interface ListContext {
    type: listType,
    isOrdered: Accessor<boolean>,
    bulletType: Accessor<bulletType>,
    bulletBgUrl: Accessor<bulletType | undefined>,
    'bullet-class'?: string,
}

const isPredefined = (t: bulletType) => (PREDEFINED_TYPES as readonly string[]).includes(t as string);

export const ListContext = createContext<ListContext>();
const List: ParentComponent<ListProps> = (props) => {
    const itemTokens = useTokens(Item, props.children);
    const nestedContext = useContext(NestedListContext);
    
    const isOrdered = createMemo(() => props.type === 'ordered' || props["bullet-type"] === 'number');

    const bulletType = createMemo(() => {
        const type = props["bullet-type"];

        if (!type) return isOrdered() ? 'number' : 'disc'
        if (isPredefined(type)) return type;
        
        return type;
    })

    const bulletBgUrl = createMemo(() => !isPredefined(bulletType()) ? props["bullet-type"] : undefined)

    const contextValue = {
        type: props.type || 'unordered',
        isOrdered,
        bulletType,
        bulletBgUrl,
        'bullet-class': props["bullet-class"] ?? undefined
    }

    const vnode = (
        <ListContext.Provider value={contextValue}>
            <LayoutBase class={`${styles.list}`} {...props}>
                <For each={itemTokens()}>
                    {(item, index) => (
                        <ListItem 
                            item={item} 
                            parentChildren={props.children}
                            index={index()} />
                    )}
                </For>
            </LayoutBase>
        </ListContext.Provider>
    )

    if (nestedContext) {
        onMount(() => nestedContext.mountNested(vnode));
        return null;
    }
    
    return vnode
}

export default Object.assign(List, { Item, Icon });