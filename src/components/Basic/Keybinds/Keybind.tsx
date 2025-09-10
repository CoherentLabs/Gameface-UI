import { createEffect, createSignal, on, onCleanup, onMount, useContext } from "solid-js";
import style from './KeyBinds.module.scss'
import { KeybindsContext } from "./Keybinds";
import codeToChar from "./util/codeToChar";
import { ComponentProps } from "@components/types/ComponentProps";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import buttonToCode from "./util/buttonToCode";

interface KeyBindProps extends ComponentProps {
    action: string,
    value?: string,
}

const KeyBind = (props: KeyBindProps) => {
    const context = useContext(KeybindsContext)
    if (!context) {
        console.warn('Please use Keybind component only inside the Keybinds component')
        return
    }

    const initialValue = props.value ? props.value.toUpperCase() : null;
    const [label, setLabel] = createSignal(initialValue ?? context.placeholder ?? "");
    const [listening, setListening] = createSignal(false);
    let el!: HTMLDivElement;

    createEffect(on(() => context.bindings[props.action], (v) => {
        setLabel(v as string ?? context.placeholder ?? "")
    }, { defer: true }));

    const startListening = () => {
        setListening(true);
        el.focus();
        window.addEventListener("keydown", onKeyDown, { capture: true });
        window.addEventListener("mousedown", onMousedown, { capture: true });
        window.addEventListener("mouseup", stopListening, { capture: true });
    };

    const stopListening = () => {
        window.removeEventListener("keydown", onKeyDown, { capture: true });
        window.removeEventListener("mousedown", onMousedown, { capture: true });
        window.removeEventListener("mouseup", stopListening, { capture: true });
        setListening(false);
    };

    const eatEvent = (e :Event) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    } 

    const formatCode = (code: string) => {
        let formatted;
        if (context.useChars) formatted = codeToChar[code];

        if (!formatted) {
            formatted = code
                .replace(/^Key([A-Z])$/, '$1')         // KeyA -> A
                .replace(/^Digit(\d)$/, '$1')          // Digit1 -> 1
                .replace(/^Numpad(.+)$/, 'Numpad $1')  // NumpadAdd -> Numpad Add
                .replace('Arrow', 'Arrow ')            // ArrowUp -> Arrow Up
                .replace(/([a-z])([A-Z])/g, '$1 $2');  // camel -> spaced (PageDown -> Page Down)
        }
        
        return formatted;
    }

    const onKeyDown = (e: KeyboardEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const text = formatCode(e.code);
        context.bind(props.action, text);
        stopListening();
        context.onChange?.(props.action, text);
    };

    const onMousedown = (e: MouseEvent) => {
        const text = buttonToCode(e.button);
        context.bind(props.action, text);
        stopListening();
        context.onChange?.(props.action, text);
        window.addEventListener("mouseup", eatEvent, { capture: true, once: true });
    }

    onMount(() => {
        if (props.ref) (props.ref as unknown as (ref: HTMLDivElement) => void) (el);

        context.bind(props.action, initialValue);
    })

    const { forwardEvents, forwardAttrs } = useBaseComponent(props);

    return (
        <div 
            ref={el} 
            class={`${style.keybind} ${props.class ?? ''}`}
            style={props.style}
            use:forwardEvents={props}
            use:forwardAttrs={props}
            onmouseup={startListening}>
            {listening() ? (context.listeningText ?? 'Press any key...') : label()}
        </div>
    )
}

export default KeyBind;