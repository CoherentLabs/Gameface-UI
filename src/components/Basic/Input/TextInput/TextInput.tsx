import { After, Before, Input, Placeholder } from "../shared/tokens";
import { onMount, createMemo, ParentComponent } from "solid-js";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { useToken } from '@components/utils/tokenComponents';
import { InputBase } from "../InputBase/InputBase";
import useTextInput from "../shared/useTextInput";
import { TextInputProps } from "../shared/types";
import AddonSlot from "../shared/AddonSlot";
import baseStyles from '../InputBase/InputBase.module.scss';
import styles from '../shared/TextInput.module.scss';

const TextInput: ParentComponent<TextInputProps> = (props) => {
    const BeforeToken = useToken(Before, props.children);
    const AfterToken = useToken(After, props.children);

    let element!: HTMLDivElement;
    let inputElement!: HTMLInputElement;

    const {value, handleChange, changeValue, clear } = useTextInput(props);
    
    const textInputClasses = createMemo(() => {
        const classes = [baseStyles['input-wrapper']];
        
        if (props.disabled) {
            classes.push(baseStyles.disabled);
            
            if (props['class-disabled']) classes.push(`${props['class-disabled']}`);
        }
        
        return classes.join(' ');
    });
    
    props.componentClasses = () => textInputClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);
    
    onMount(() => {
        if (!props.ref || !element) return;
        
        (props.ref as unknown as (ref: any) => void)({
            element,
            input: inputElement,
            value,
            changeValue,
            clear
        });
    });
    
    return (
        <div 
            ref={element!}
            class={className()} 
            style={inlineStyles()} 
            use:forwardEvents={props}
            use:forwardAttrs={props}>
            
            <AddonSlot token={BeforeToken} className={styles.before} />

            <InputBase 
                type={'text'}
                value={value}
                ref={inputElement!}
                handleChange={handleChange} 
                parentChildren={props.children}
                hasBefore={!!BeforeToken()}
                hasAfter={!!AfterToken()}
            />

            <AddonSlot token={AfterToken} className={styles.after} />

        </div>
    )
}

export default Object.assign(TextInput, { Before, After, Input, Placeholder });