import { After, Before, Input } from "../shared/tokens";
import { onMount, createMemo, ParentComponent, createSignal, Switch, Match, Accessor } from "solid-js";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { useToken } from '@components/utils/tokenComponents';
import { InputBase } from "../InputBase/InputBase";
import useTextInput from "../shared/useTextInput";
import { TextInputProps, TextInputRef } from "../shared/types";
import { VisibilityButton, VisibilityButtonComponent } from "./VisibilityButton";
import AddonSlot from "../shared/AddonSlot";
import styles from '../shared/TextInput.module.css';
import baseStyles from '../InputBase/InputBase.module.css';

export interface PasswordInputRef extends TextInputRef {
    show: () => void,
    hide: () => void,
    visible: Accessor<boolean>,
}

const PasswordInput: ParentComponent<TextInputProps> = (props) => {
    const BeforeToken = useToken(Before, props.children);
    const AfterToken = useToken(After, props.children);
    const VisibilityButtonToken = useToken(VisibilityButton, props.children);

    let element!: HTMLDivElement;
    let inputElement!: HTMLInputElement;

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
    
    const passwordInputClasses = createMemo(() => {
        const classes = [baseStyles['input-wrapper']];
        
        if (props.disabled) {
            classes.push(baseStyles.disabled);
            
            if (props['class-disabled']) classes.push(`${props['class-disabled']}`);
        }
        
        return classes.join(' ');
    });
    
    props.componentClasses = () => passwordInputClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);
    
    onMount(() => {
        if (!props.ref || !element) return;
        
        (props.ref as unknown as (ref: any) => void)({
            element,
            input: inputElement,
            value,
            changeValue,
            visible,
            clear,
            show,
            hide
        });
    });
    
    return (
        <div 
            ref={element!}
            class={className()} 
            style={inlineStyles()} 
            use:forwardEvents={props}
            use:forwardAttrs={props}>

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
                ref={inputElement!}
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

        </div>
    )
}

export default Object.assign(PasswordInput, { Before, After, Input, VisibilityButton });