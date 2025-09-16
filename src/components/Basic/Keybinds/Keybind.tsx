import { createEffect, createSignal, on, onMount, useContext } from "solid-js";
import style from './KeyBinds.module.scss'
import { KeybindsContext } from "./Keybinds";
import codeToChar from "./util/codeToChar";
import { ComponentProps } from "@components/types/ComponentProps";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import buttonToCode from "./util/buttonToCode";
import { WHEEL_DOWN_CODE, WHEEL_UP_CODE } from "./util/wheelCodes";

interface KeyBindProps extends ComponentProps {
    action: string,
    value?: string,
}

const Keybind = (props: KeyBindProps) => {
    const context = useContext(KeybindsContext)
    if (!context) {
        console.warn('Please use the Keybind component only inside the Keybinds component')
        return
    }

    const [label, setLabel] = createSignal(context.bindings[props.action] ?? context.placeholder?.() ?? "");
    const [listening, setListening] = createSignal(false);
    let el!: HTMLDivElement;

    createEffect(on(() => context.bindings[props.action], (v) => {
        setLabel(v as string ?? context.placeholder?.() ?? "")
    }, {defer: true}));

    const startListening = () => {
        setListening(true);
        el.focus();
        window.addEventListener("keydown", onKeyDown, { capture: true });
        window.addEventListener("mousedown", onMousedown, { capture: true });
        window.addEventListener("wheel", onWheel, { capture: true });
        window.addEventListener("mouseup", stopListening, { capture: true, passive: false });
    };

    const stopListening = () => {
        window.removeEventListener("keydown", onKeyDown, { capture: true });
        window.removeEventListener("mousedown", onMousedown, { capture: true });
        window.removeEventListener("wheel", onWheel, { capture: true });
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
        if (context.useChars?.()) formatted = codeToChar[code];

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
        bindKey(e, formatCode(e.code));
    };

    const onMousedown = (e: MouseEvent) => {
        bindKey(e, buttonToCode(e.button));
        window.addEventListener("mouseup", eatEvent, { capture: true, once: true });
    }

    const onWheel = (e: WheelEvent) => {
        bindKey(e, e.deltaY < 0 ? WHEEL_UP_CODE : WHEEL_DOWN_CODE);
    }

    const bindKey = (e: Event, code: string | null) => {
        e.preventDefault();
        e.stopPropagation();

        const success = context.bind(props.action, code);
        stopListening();
        if (success) context.onChange?.(props.action, code);
    }

    onMount(() => {
        if (props.ref) (props.ref as unknown as (ref: HTMLDivElement) => void) (el);

        if (context.bindings[props.action] === undefined) context.bind(props.action, props.value ?? null);
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
            {listening() ? (context.listeningText?.() ?? 'Press any key...') : label()}
        </div>
    )
}

export default Keybind;