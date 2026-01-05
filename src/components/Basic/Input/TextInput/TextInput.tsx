import { After, Before, Input, Placeholder } from "../shared/tokens";
import { ParentComponent } from "solid-js";
import { useToken } from '@components/utils/tokenComponents';
import { InputBase } from "../InputBase/InputBase";
import useTextInput from "../shared/useTextInput";
import { TextInputProps } from "../shared/types";
import AddonSlot from "../shared/AddonSlot";
import InputWrapper from "../InputBase/InputWrapper";
import styles from '../shared/TextInput.module.scss';

const TextInput: ParentComponent<TextInputProps> = (props) => {
    const BeforeToken = useToken(Before, props.children);
    const AfterToken = useToken(After, props.children);

    const {value, handleChange, changeValue, clear } = useTextInput(props);
    const inputRef = { current: undefined as HTMLInputElement | undefined };
    const refObject = {
        value,
        changeValue,
        clear
    }
    
    return (
        <InputWrapper 
            props={props} 
            inputRef={inputRef}
            refObject={refObject}>
            
            <AddonSlot token={BeforeToken} className={styles.before} />

            <InputBase 
                type={'text'}
                value={value}
                ref={(el) => inputRef.current = el}
                handleChange={handleChange} 
                parentChildren={props.children}
                hasBefore={!!BeforeToken()}
                hasAfter={!!AfterToken()}
            />

            <AddonSlot token={AfterToken} className={styles.after} />

        </InputWrapper>
    )
}

export default Object.assign(TextInput, { Before, After, Input, Placeholder });