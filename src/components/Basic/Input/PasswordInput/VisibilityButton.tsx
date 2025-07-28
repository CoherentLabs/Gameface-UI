import { createMemo, ParentComponent } from "solid-js";
import { TokenComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import EyeIcon from './eye.svg?component-solid'
import EyeOffIcon from './eye-off.svg?component-solid'
import styles from './PasswordInput.module.css';
import sharedStyles from '../shared/TextInput.module.css';

interface VisibilityButtonComponentProps extends TokenComponentProps {
    visible: () => boolean,
    toggle: () => void;
}

interface VisibilityButtonTokenProps extends TokenBase {
    position?: 'before' | 'after'
}

export const VisibilityButton = createTokenComponent<VisibilityButtonTokenProps>();

export const VisibilityButtonComponent: ParentComponent<VisibilityButtonComponentProps> = (props) => {
    const VisibilityButtonToken = useToken(VisibilityButton, props.parentChildren);

    const VisibilityButtonClasses = createMemo(() => {
        const classes = [styles['visibility-button']];

        classes.push(VisibilityButtonToken()?.position === 'before' ? sharedStyles.before : sharedStyles.after);
        classes.push(VisibilityButtonToken()?.class ?? '');

        return classes.join(' ');
    });

    return (
        <div 
            class={VisibilityButtonClasses()} 
            style={VisibilityButtonToken()?.style} 
            onclick={props.toggle}>
            {VisibilityButtonToken()?.children || (props.visible() ? <EyeIcon /> : <EyeOffIcon /> )}
        </div>
    )
}
