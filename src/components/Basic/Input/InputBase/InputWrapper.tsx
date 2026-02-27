import mergeNavigationActions from "@components/utils/mergeNavigationActions"
import baseStyles from '../InputBase/InputBase.module.scss';
import { createMemo, onMount, ParentComponent } from "solid-js";
import { ComponentNavigationActions } from "@components/types/ComponentProps";
import { useNavigation } from "@components/Utility/Navigation/Navigation";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";

interface InputWrapperProps {
    props: any,
    refObject: any,
    inputRef: { current: HTMLInputElement | undefined };
    navActions?: ComponentNavigationActions
}

const InputWrapper: ParentComponent<InputWrapperProps> = (wrapperProps) => {
    let element!: HTMLDivElement;
    const nav = useNavigation()

    const inputWrapperClasses = createMemo(() => {
        const classes = [baseStyles['input-wrapper']];

        if (wrapperProps.props.disabled) {
            classes.push(baseStyles.disabled);
            if (wrapperProps.props['class-disabled']) {
                classes.push(wrapperProps.props['class-disabled']);
            }
        }

        return classes.join(' ');
    });

    onMount(() => {
        if (!wrapperProps.props.ref || !element) return;
        
        (wrapperProps.props.ref as unknown as (ref: any) => void)({
            element,
            input: wrapperProps.inputRef.current,
            ...wrapperProps.refObject,
        });
    });
    
    wrapperProps.props.componentClasses = () => inputWrapperClasses();
    
    return (
        <div 
            ref={element!}
            use:baseComponent={wrapperProps.props}
            use:navigationActions={mergeNavigationActions(wrapperProps.props, {
                'select': () => {
                    nav?.pauseNavigation();
                    wrapperProps.inputRef.current?.focus();
                },
                'back': () => {
                    nav?.resumeNavigation();
                    wrapperProps.inputRef.current?.blur()
                },
                ...wrapperProps.navActions
            })}>
            {wrapperProps.children}
        </div>
    )
}

export default InputWrapper;