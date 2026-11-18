import { ParentComponent } from "solid-js";
import { TokenComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import EyeIcon from './eye.svg?component-solid'
import EyeOffIcon from './eye-off.svg?component-solid'
import styles from './PasswordInput.module.scss';
import sharedStyles from '../shared/TextInput.module.scss';

interface VisibilityButtonComponentProps extends TokenComponentProps {
    visible: () => boolean,
    toggle: () => void;
}

interface VisibilityButtonTokenProps extends TokenBase {
    position?: 'before' | 'after'
}

export const VisibilityButton = createTokenComponent<VisibilityButtonTokenProps>();

export const VisibilityButtonComponent: ParentComponent<VisibilityButtonComponentProps> = (props) => {
    const VisibilityButtonToken = useToken(VisibilityButton, () => props.parentChildren);

    const VisibilityButtonClasses = () => [
        styles['visibility-button'],
        VisibilityButtonToken()?.position === 'before' ? sharedStyles.before : sharedStyles.after,
        VisibilityButtonToken()?.class,
    ];

    return (
        <div 
            class={VisibilityButtonClasses()} 
            style={VisibilityButtonToken()?.style} 
            onClick={() => props.toggle()}>
            {VisibilityButtonToken()?.children || (props.visible() ? <EyeIcon /> : <EyeOffIcon /> )}
        </div>
    )
}
