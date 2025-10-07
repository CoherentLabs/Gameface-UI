import { createMemo, createSignal, onMount, useContext } from "solid-js";
import { KeybindsContext } from "./Keybinds";
import { ComponentProps } from "@components/types/ComponentProps";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import style from './Keybinds.module.scss'
import { BindingCode, BindingLabel } from "./util/mappings";

interface KeyBindProps extends ComponentProps {
    action: string,
    value?: BindingLabel | (string & {}),
}

const Keybind = (props: KeyBindProps) => {
    const context = useContext(KeybindsContext)
    if (!context) {
        console.warn('Please use the Keybind component only inside the Keybinds component')
        return
    }

    const [listening, setListening] = createSignal(false);
    let el!: HTMLDivElement;

    const label = createMemo(() => {
        if (listening()) return context.listeningText?.() ?? 'Press any key...';
        
        return context.bindings[props.action] || (context.placeholder?.() ?? '');
    })

    const startListening = () => {
        setListening(true);
        el.focus();
        window.addEventListener("keydown", onKeyDown, true);
        window.addEventListener("mousedown", onMousedown, true);
        window.addEventListener("wheel", onWheel, true);
        window.addEventListener("mouseup", stopListening, { capture: true, passive: false });
    };

    const stopListening = () => {
        window.removeEventListener("keydown", onKeyDown, true);
        window.removeEventListener("mousedown", onMousedown, true);
        window.removeEventListener("wheel", onWheel, true);
        window.removeEventListener("mouseup", stopListening, true);
        setListening(false);
    };

    const eatEvent = (e :Event) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    } 

    const onKeyDown = (e: KeyboardEvent) => {
        bindKey(e, context.KEYS[e.code as BindingCode]);
    };

    const onMousedown = (e: MouseEvent) => {
        bindKey(e, context.KEYS[String(e.button) as BindingCode]);
        window.addEventListener("mouseup", eatEvent, { capture: true, once: true });
    }

    const onWheel = (e: WheelEvent) => {
        const wheelCode = e.deltaY < 0 ? 'WheelUp' : 'WheelDown';
        bindKey(e, context.KEYS[wheelCode]);
    }

    const bindKey = (e: Event, code: string | null) => {
        e.preventDefault();
        e.stopPropagation();

        const prevKey = context.bindings[props.action] || null;  
        const success = context.bind(props.action, code);
        stopListening();
        if (success) context.onChange?.(prevKey, code, props.action);
    }

    onMount(() => {
        if (props.ref) (props.ref as unknown as (ref: HTMLDivElement) => void) (el);

        if (context.bindings[props.action] === undefined) context.bind(props.action, props.value ?? null);
    })

    props.componentClasses = style.keybind;
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    return (
        <div 
            ref={el} 
            class={className()}
            style={inlineStyles()}
            use:forwardEvents={props}
            use:forwardAttrs={props}
            onmouseup={startListening}>
            {label()}
        </div>
    )
}

export default Keybind;