import { createMemo, ParentComponent, Show } from "solid-js";
import { TokenComponentProps } from '@components/types/ComponentProps';
import { useToken } from "@components/utils/tokenComponents";
import { Input, Placeholder, VisibilityButton } from "../shared/tokens";
import EyeIcon from './eye.svg?component-solid'
import EyeOffIcon from './eye-off.svg?component-solid'
import styles from './PasswordInput.module.css';
import baseStyles from '../InputBase/InputBase.module.css';

interface VisibilityButtonComponentProps extends TokenComponentProps {
    type: 'text' | 'password';
    toggle: () => void;
}

export const VisibilityButtonComponent: ParentComponent<VisibilityButtonComponentProps> = (props) => {
    const VisibilityButtonToken = useToken(VisibilityButton, props.parentChildren);

    const VisibilityButtonClasses = createMemo(() => {
        const classes = [styles.VisibilityButton];

        classes.push(VisibilityButtonToken()?.position === 'before' ? baseStyles.Before : baseStyles.After);
        classes.push(VisibilityButtonToken()?.class ?? '');

        return classes.join(' ');
    });

    return (
        <div 
            class={VisibilityButtonClasses()} 
            style={VisibilityButtonToken()?.style} 
            onclick={props.toggle}>
            {VisibilityButtonToken()?.children || (props.type === 'password' ? <EyeIcon /> : <EyeOffIcon /> )}
        </div>
    )
}
