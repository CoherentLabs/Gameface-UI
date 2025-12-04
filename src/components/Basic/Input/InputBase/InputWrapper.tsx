import useBaseComponent from "@components/BaseComponent/BaseComponent";
import mergeNavigationActions from "@components/utils/mergeNavigationActions"
import baseStyles from '../InputBase/InputBase.module.scss';
import { createMemo, onMount, ParentComponent } from "solid-js";

interface InputWrapperProps {
    props: any,
    refObject: any,
    inputRef: { current: HTMLInputElement | undefined };
}

const InputWrapper: ParentComponent<InputWrapperProps> = (wrapperProps) => {
    let element!: HTMLDivElement;

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
    const { className, inlineStyles, forwardEvents, forwardAttrs, navigationActions } = useBaseComponent(wrapperProps.props);
    
    return (
        <div 
            ref={element!}
            class={className()} 
            style={inlineStyles()} 
            use:forwardEvents={wrapperProps.props}
            use:forwardAttrs={wrapperProps.props}
            use:navigationActions={mergeNavigationActions(wrapperProps.props, {
                'select': () => wrapperProps.inputRef.current!.focus(),
                'back': () => wrapperProps.inputRef.current!.blur(),
            })}>
            {wrapperProps.children}
        </div>
    )
}

export default InputWrapper;