import { createEffect, createSignal, on, onCleanup } from "solid-js";
import style from './KeyBind.module.scss'
import eventBus from "@components/tools/EventBus";

interface KeyBindProps {
    id: string,
    default?: string,
}


const KeyBind = (props: KeyBindProps) => {
    const [label, setLabel] = createSignal(props.default ?? "Unbound");
    const [listening, setListening] = createSignal(false);
    let el!: HTMLDivElement;

    createEffect(
        on(() => props.default, d => {
            if (!listening()) setLabel(d ?? "Unbound");
        })
    );

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
        setLabel(text);
        stopListening();
        eventBus.emit('button-changed', {id: props.id, value: text});
    };

    onCleanup(stopListening);

    return (
        <div ref={el} onClick={startListening} class={style.keybind}>
            {listening() ? 'Press any key...' : label()}
        </div>
    )
}

export default KeyBind;