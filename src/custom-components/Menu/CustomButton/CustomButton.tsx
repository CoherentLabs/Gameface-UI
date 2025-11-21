import Flex from "@components/Layout/Flex/Flex"
import { useContext } from "solid-js";
import { MenuContext } from "../../../views/menu/Menu";
import { Icon } from "@components/Media/Icon/Icon";
import styles from './CustomButton.module.scss';

interface CustomButtonProps {
    text: string,
    variation: 'select' | 'back',
    handler?: (...args: any) => void
}

const CustomButton = (props: CustomButtonProps) => {
    const menuContext = useContext(MenuContext)

    const IconComponent = props.variation === 'select' 
        ? <Icon.gamepad.xbox.a class={styles['button-icon']} />
        : <Icon.gamepad.xbox.b class={styles['button-icon']} />

    const KeyComponent = <div class={styles['button-key']}>{props.variation === 'select' ? 'Enter' : 'ESC'}</div>

    return (
        <Flex direction="row" align-items="center" class={styles.button} click={props.handler}>
            {menuContext?.inputType() === 'gamepad' ? IconComponent : KeyComponent}
            <div>{props.text}</div>
        </Flex>
    )
}

export default CustomButton;