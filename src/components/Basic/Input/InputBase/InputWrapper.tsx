import mergeNavigationActions from "@components/utils/mergeNavigationActions"
import baseStyles from '../InputBase/InputBase.module.scss';
import { ParentComponent, untrack } from "solid-js";
import { ComponentNavigationActions } from "@components/types/ComponentProps";
import { useNavigation } from "@components/Utility/Navigation/Navigation";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";

interface InputWrapperProps {
    props: any,
    refObject: any,
    inputRef: { current: HTMLInputElement | undefined };
    navActions?: ComponentNavigationActions
}

const InputWrapper: ParentComponent<InputWrapperProps> = (wrapperProps) => {
    const nav = useNavigation()
    // Both are fixed objects created once by the input component: read them once.
    const inputRef = untrack(() => wrapperProps.inputRef);

    // The ref runs while the wrapper renders, before the child <input> exists,
    // so `input` is a getter (always the current element).
    const refApi = {
        ...untrack(() => wrapperProps.refObject),
        get input() { return inputRef.current; },
    };

    return (
        <div
            class={[
                baseStyles['input-wrapper'],
                wrapperProps.props.disabled && baseStyles.disabled,
                wrapperProps.props.disabled && wrapperProps.props['class-disabled'],
                wrapperProps.props.class,
            ]}
            style={wrapperProps.props.style}
            ref={[
                exposeRef(wrapperProps.props, refApi),
                baseComponent(wrapperProps.props),
                navigationActions(mergeNavigationActions(wrapperProps.props, {
                    'select': () => {
                        nav?.pauseNavigation();
                        inputRef.current?.focus();
                    },
                    'back': () => {
                        nav?.resumeNavigation();
                        inputRef.current?.blur()
                    },
                    ...wrapperProps.navActions
                })),
            ]}>
            {wrapperProps.children}
        </div>
    )
}

export default InputWrapper;
