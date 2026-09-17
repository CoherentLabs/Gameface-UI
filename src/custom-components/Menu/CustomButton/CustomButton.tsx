import Flex from "@components/Layout/Flex/Flex"
import { useContext } from "solid-js";
import { MenuContext } from "../../../views/menu/Menu";
import Image from '@components/Media/Image/Image';
import styles from './CustomButton.module.scss';

interface CustomButtonProps {
    text: string,
    variation: 'select' | 'back',
    handler?: (...args: any) => void
}

const CustomButton = (props: CustomButtonProps) => {
    const menuContext = useContext(MenuContext)

    const IconComponent = props.variation === 'select' 
        ? <Image.icons.gamepad.xbox.a class={styles['button-icon']} />
        : <Image.icons.gamepad.xbox.b class={styles['button-icon']} />

    const KeyComponent = <div class={styles['button-key']}>{props.variation === 'select' ? 'Enter' : 'ESC'}</div>

    return (
        <Flex direction="row" align-items="center" class={styles.button} click={props.handler}>
            {menuContext?.inputType() === 'gamepad' ? IconComponent : KeyComponent}
            <div>{props.text}</div>
        </Flex>
    )
}

export default CustomButton;