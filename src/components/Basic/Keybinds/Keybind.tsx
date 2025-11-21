import { createMemo, createSignal, JSX, onMount, useContext } from "solid-js";
import { KeybindsContext, KeyCode } from "./Keybinds";
import { ComponentProps } from "@components/types/ComponentProps";
import style from './Keybinds.module.scss'
import { BindingCode, BindingLabel } from "./util/mappings";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import { gamepad, GamepadInput, GamepadMappings } from "coherent-gameface-interaction-manager";
import { GamepadBindingCode } from "./util/glyphs";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";
import { useNavigation } from "@components/Utility/Navigation/Navigation";

interface KeyBindProps extends ComponentProps {
    action: string,
    value?: BindingLabel | GamepadInput | (string & {}),
}

const Keybind = (props: KeyBindProps) => {
    const context = useContext(KeybindsContext)
    if (!context) {
        console.warn('Please use the Keybind component only inside the Keybinds component')
        return
    }

    const [listening, setListening] = createSignal(false);
    let el!: HTMLDivElement;
    const nav = useNavigation();

    const label = createMemo(() => {
        if (listening()) return context.listeningText?.() ?? 'Press any key...';

        const currentValue = context.bindings[props.action];
        if (!currentValue) return context.placeholder?.() ?? '';

        if (context.mode === 'gamepad') {
            const DisplayValue = context.GLYPHS[currentValue as GamepadBindingCode];
            if (typeof DisplayValue === 'function') {
                return DisplayValue({});
            }
            return DisplayValue as JSX.Element;
        }
        
        return currentValue;
    })

    const startListening = () => {
        if (context.mode === 'gamepad') return;
        
        setListening(true)
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

    const startListeningGamepad = () => {
        if (context.mode !== 'gamepad') {
            startListening()
            return;
        }

        setListening(true);
        // pause all actions
        nav?.pauseInput();

        let isFinished = false;
        // axis callbacks references
        const registeredCallbacks: Record<string, () => void> = {};

        const stopAllListeners = () => {
            clearInterval(pollInterval);
            // remove axes callbacks
            for (const alias in registeredCallbacks) {
                gamepad.off([alias as GamepadInput], registeredCallbacks[alias]);
            }
        };

        const bindAndCleanup = (inputCode: KeyCode, isButton: boolean = false, pressedBtnObj?: GamepadButton) => {
            if (isFinished) return;
            isFinished = true;

            stopAllListeners();
            
            const prevKey = context.bindings[props.action] || null;
            const success = context.bind(props.action, inputCode);
            
            if (success) context.onChange?.(prevKey, String(inputCode), props.action);
            setListening(false);

            if (isButton && pressedBtnObj) {
                const releaseInterval = setInterval(() => {
                    if (!pressedBtnObj.pressed) {
                        clearInterval(releaseInterval);
                        nav?.resumeInput();
                    }
                }, 500);
            } else {
                nav?.resumeInput();
            }
        };

        // Stick logic
        GamepadMappings.axisAliases.forEach((alias, index) => {
            if (index <= 1) return;
            // Create the specific reference
            const callback = () => bindAndCleanup(alias as KeyCode);
            // Save it for later
            registeredCallbacks[alias] = callback;
            // Register it
            gamepad.on({ actions: [alias], callback });
        });

        // Button logic
        const pollInterval = setInterval(() => {
            const gamepad = navigator.getGamepads()[0];
            if (!gamepad || isFinished) return;
            
            let buttonIdx = -1;
            const pressedButton = gamepad?.buttons.find((btn, idx) => {
                if (btn.pressed) {
                    buttonIdx = idx;
                    return btn
                }
            })

            if (pressedButton) bindAndCleanup(buttonIdx as any as KeyCode, true, pressedButton);
        }, 150)
    }

    const eatEvent = (e: Event) => {
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
        if (props.ref) (props.ref as unknown as (ref: HTMLDivElement) => void)(el);

        if (context.bindings[props.action] === undefined) context.bind(props.action, props.value ?? null);
    })

    props.componentClasses = style.keybind;

    return (
        <div
            ref={el}
            use:baseComponent={props}
            use:navigationActions={mergeNavigationActions(props, {'select': startListeningGamepad})}
            onmouseup={startListening}>
            {label()}
        </div>
    )
}

export default Keybind;