import { After, Before, Input } from "../shared/tokens";
import { createMemo, ParentComponent, createSignal, Switch, Match, Accessor } from "solid-js";
import { useToken } from '@components/utils/tokenComponents';
import { InputBase } from "../InputBase/InputBase";
import useTextInput from "../shared/useTextInput";
import { TextInputProps, TextInputRef } from "../shared/types";
import { VisibilityButton, VisibilityButtonComponent } from "./VisibilityButton";
import AddonSlot from "../shared/AddonSlot";
import InputWrapper from "../InputBase/InputWrapper";
import styles from '../shared/TextInput.module.scss';

export interface PasswordInputRef extends TextInputRef {
    show: () => void,
    hide: () => void,
    visible: Accessor<boolean>,
}

const PasswordInput: ParentComponent<TextInputProps> = (props) => {
    const BeforeToken = useToken(Before, props.children);
    const AfterToken = useToken(After, props.children);
    const VisibilityButtonToken = useToken(VisibilityButton, props.children);

    const {value, handleChange, changeValue, clear } = useTextInput(props);
    const [type, setType] = createSignal<'text' | 'password'>('password');
    const visible = createMemo(() => type() !== 'password')

    const toggleVisibility = () => {
        if (type() === 'password') show();
        else hide();
    }

    const show = () => {
        setType('text');
    }
    
    const hide = () => {
        setType('password');
    }

    const visibilityPosition = createMemo(() => VisibilityButtonToken()?.position ?? 'after');
    const isBefore = createMemo(() => !!VisibilityButtonToken() && visibilityPosition() === 'before');
    const isAfter = createMemo(() => !!VisibilityButtonToken() && visibilityPosition() === 'after');

    const inputRef = { current: undefined as HTMLInputElement | undefined };
    const refObject = {
        value,
        changeValue,
        visible,
        clear,
        show,
        hide
    }
    
    return (
        <InputWrapper 
            props={props} 
            inputRef={inputRef}
            refObject={refObject}>

            <Switch>
                <Match when={isBefore()}>
                    <VisibilityButtonComponent 
                        visible={visible}
                        toggle={toggleVisibility}
                        parentChildren={props.children} />
                </Match>
                <Match when={!isBefore()}>
                    <AddonSlot token={BeforeToken} className={styles.Before} />
                </Match>
            </Switch>

            <InputBase 
                type={type()}
                value={value}
                ref={(el) => inputRef.current = el}
                handleChange={handleChange} 
                parentChildren={props.children}
                hasBefore={isBefore() || !!BeforeToken()}
                hasAfter={isAfter() || !!AfterToken()}
            />

            <Switch>
                <Match when={isAfter()}>
                    <VisibilityButtonComponent 
                        visible={visible}
                        toggle={toggleVisibility}
                        parentChildren={props.children} />
                </Match>
                <Match when={!isAfter()}>
                    <AddonSlot token={AfterToken} className={styles.After} />
                </Match>
            </Switch>

        </InputWrapper>
    )
}

export default Object.assign(PasswordInput, { Before, After, Input, VisibilityButton });