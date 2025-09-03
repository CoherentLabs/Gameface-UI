import Flex from "@components/Layout/Flex/Flex";
import Block from "@components/Layout/Block/Block";
import { createMemo, For, ParentComponent, useContext } from "solid-js";
import styles from './MenuItem.module.scss';
import { MenuContext } from "../../../views/menu/Menu";

interface MenuItemsProps {
    id: string,
    name: string
}

const MenuItem: ParentComponent<MenuItemsProps> = (props) => {
    const menuContext = useContext(MenuContext)

    const isActive = createMemo(() => menuContext?.currentOption() === props.id); 
    const handleMouseEnter = () => {
        menuContext?.setCurrentOption(props.id);
    }

    return (
        <Block class={`${styles['item-container']} ${isActive() ? styles.active : ''}`} mouseenter={handleMouseEnter}>
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