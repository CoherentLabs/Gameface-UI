import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createContext, createMemo, For, onSettled, ParentComponent, useContext } from "solid-js";
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
    bulletClass: Accessor<string>;
}

const isPredefined = (t: bulletType) => (PREDEFINED_TYPES as readonly string[]).includes(t as string);

// `null` default: ListIcon reads it optionally (pattern 1.3.o).
export const ListContext = createContext<ListContext | null>(null);
const List: ParentComponent<ListProps> = (props) => {
    const itemTokens = useTokens(Item, () => props.children);
    const nestedContext = useContext(NestedListContext);
    
    const isOrdered = createMemo(() => props.type === 'ordered' || props["bullet-type"] === 'number');

    const bulletType = createMemo(() => {
        const type = props["bullet-type"];

        const listIsOrdered = isOrdered();

        if (!type && !listIsOrdered) return 'disc'
        else if(!type || listIsOrdered) return 'number'

        if (isPredefined(type)) return type;
        
        return type;
    })

    const bulletBgUrl = createMemo(() => !isPredefined(bulletType()) ? props["bullet-type"] : undefined)
    const bulletClass = createMemo(() => props["bullet-class"] ?? "");

    const contextValue = {
        get type() { return props.type || 'unordered'; },
        isOrdered,
        bulletType,
        bulletBgUrl,
        bulletClass,
    }

    const vnode = (
        <ListContext value={contextValue}>
            <LayoutBase {...props} class={[styles.list, props.class]}>
                <For each={itemTokens()}>
                    {(item, index) => (
                        <ListItem 
                            item={item} 
                            parentChildren={props.children}
                            index={index()} />
                    )}
                </For>
            </LayoutBase>
        </ListContext>
    )

    if (nestedContext) {
        onSettled(() => { nestedContext.mountNested(vnode); });
        // eslint-disable-next-line solid/components-return-once -- nesting is fixed for the list's lifetime
        return null;
    }
    
    return vnode
}

export default Object.assign(List, { Item, Icon });