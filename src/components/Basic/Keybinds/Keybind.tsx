import { createEffect, createSignal, on, onCleanup, onMount, useContext } from "solid-js";
import style from './KeyBinds.module.scss'
import { KeybindsContext } from "./Keybinds";

interface KeyBindProps {
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

    onMount(() => {
        context.bind(props.action, initialValue);
    })

    createEffect(on(() => context.bindings[props.action], (v) => {
        setLabel(v as string ?? context.placeholder ?? "")
    }, { defer: true }));

    const startListening = () => {
        setListening(true);
        el.focus();
        window.addEventListener("keydown", onKeyDown, { capture: true });
        window.addEventListener("click", stopListening, { capture: true });
    };

    const stopListening = () => {
        window.removeEventListener("keydown", onKeyDown, { capture: true } as any);
        window.removeEventListener("click", stopListening, { capture: true } as any);
        setListening(false);
    };

    const formatCode = (code: string) =>
        code
            .replace(/^Key([A-Z])$/, '$1')         // KeyA -> A
            .replace(/^Digit(\d)$/, '$1')          // Digit1 -> 1
            .replace(/^Numpad(.+)$/, 'Numpad $1')  // NumpadAdd -> Numpad Add
            .replace('Arrow', 'Arrow ')            // ArrowUp -> Arrow Up
            .replace(/([a-z])([A-Z])/g, '$1 $2');  // camel -> spaced (PageDown -> Page Down)

    const onKeyDown = (e: KeyboardEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const text = formatCode(e.code);
        context.bind(props.action, text);
        stopListening();
        context.onChange?.(props.action, text)
    };

    return (
        <div ref={el} onClick={startListening} class={style.keybind}>
            {listening() ? 'Press any key...' : label()}
        </div>
    )
}

export default KeyBind;