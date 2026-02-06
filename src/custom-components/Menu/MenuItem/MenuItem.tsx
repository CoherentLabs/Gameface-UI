import Flex from "@components/Layout/Flex/Flex";
import Block from "@components/Layout/Block/Block";
import { createMemo, ParentComponent, useContext } from "solid-js";
import styles from './MenuItem.module.scss';
import { MenuContext } from "../../../views/menu/Menu";

interface MenuItemsProps {
    id: string,
    name: string
}

const MenuItem: ParentComponent<MenuItemsProps> = (props) => {
    const menuContext = useContext(MenuContext)
    let ref: HTMLDivElement;

    const isActive = createMemo(() => menuContext?.currentOption() === props.id); 
    const handleFocus = () => {
        menuContext?.setCurrentOption(props.id);
    }

    const handleMouseEnter = (event: MouseEvent) => {
        const element = event.currentTarget;
        (element as HTMLDivElement).focus();
    }

    const handleClick = (event: MouseEvent) => {
        if ((event.target as HTMLDivElement).hasAttribute('tabindex')) return;

        ref!.focus();
    }

    return (
        <Block 
            attr:id={props.id} 
            ref={ref!}
            class={`${styles['item-container']} ${isActive() ? styles.active : ''} menu-item`} 
            focus={handleFocus} 
            mouseenter={handleMouseEnter} 
            click={handleClick}>
            <Flex class={styles.item} justify-content="space-between" align-items="center">
                {props.name}
                <Flex align-items="center" style={{ height: '100%', padding: '0 3vmax' }}>
                    {props.children}
                </Flex>
            </Flex>
        </Block>
    );
}

export default MenuItem;