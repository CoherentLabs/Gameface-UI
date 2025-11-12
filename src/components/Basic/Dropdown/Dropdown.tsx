import { Accessor, createContext, createEffect, createMemo, createSignal, DEV, JSX, onMount, ParentComponent, useContext } from 'solid-js';
import style from './Dropdown.module.scss';
import { DropdownOptions, Handle, Options, Track } from './DropdownOptions';
import { Option } from './DropdownOption';
import { DropdownTrigger, Icon, Placeholder, Trigger } from './DropdownTrigger';
import { BaseComponentRef, ComponentProps } from '@components/types/ComponentProps';
import useBaseComponent from '@components/BaseComponent/BaseComponent';
import { waitForFrames } from '@components/utils/waitForFrames';
import { NavigationContext } from '@components/Navigation/Navigation/Navigation';
import resolveAnchor from '@components/utils/resolveFocusAnchor';
//@ts-ignore
import { actions, keyboard, spatialNavigation } from 'coherent-gameface-interaction-manager';
import eventBus from '@components/tools/EventBus';

export interface CommonDropdownSlotProps {
    style?: JSX.CSSProperties,
    class?: string,
}

export interface DropdownRef extends BaseComponentRef {
    selected: Accessor<string>;
    selectOption: (value: string) => void
}

export const DropdownContext = createContext<DropdownContextValue>();

interface DropdownContextValue {
    selected: Accessor<string>;
    selectOption: (value: string) => void
    open: Accessor<boolean>;
    toggle: (isOpened: boolean) => void;
    registerOption: (value: string, label: any, selected?: boolean) => void
    unregisterOption: (value: string) => void,
    options: Map<string, any>,
    isInverted: Accessor<boolean>
}

interface DropdownProps extends ComponentProps {
    disabled?: boolean
    'class-disabled'?: string
    onChange?: (value: string) => void;
    anchor?: string | HTMLElement
}

const Dropdown: ParentComponent<DropdownProps> = (props) => {
    let element!: HTMLDivElement;
    const [selected, setSelected] = createSignal('');
    const [firstRender, setFirstRender] = createSignal(true);
    const [open, setOpen] = createSignal(false);
    const [isInverted, setIsInverted] = createSignal(false);
    const options = new Map<string, any>();
    const registerOption = (value: string, label: any, selected?: boolean) => {
        options.set(value, label);
        if (selected) selectOption(value);
    };
    const unregisterOption = (value: string) => options.delete(value);

    const selectOption = (value: string) => {
        if (!options.has(value)) {
            if (DEV) console.warn(`Cannot select "${value}" as it is not a valid option in the dropdown.`);
            return;
        }

        setSelected(value);

        if (selected() !== "" && firstRender()) return setFirstRender(false);
        props.onChange?.(value);
    }

    const dropdownClasses = createMemo(() => {
        const classes = [style.dropdown];

        if (props.disabled) {
            classes.push(style['dropdown-disabled']);

            if (props['class-disabled']) classes.push(`${props['class-disabled']}`);
        }

        return classes.join(' ');
    });

    const toggle = (isOpened: boolean) => {
        if (props.disabled) return;

        if (isOpened) {
            document.addEventListener('click', closeDropdown);
            setOpen(true);
            return;
        }

        setOpen(false);
        document.removeEventListener('click', closeDropdown);
    }

    const closeDropdown = (e: MouseEvent) => {
        if (!element.contains(e.target as Node)) {
            setOpen(false);
            document.removeEventListener('mousedown', closeDropdown);
        }
    };

    props.componentClasses = () => dropdownClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    function getClipper(el: HTMLElement) {
        for (let n = el.parentElement; n; n = n.parentElement) {
            const s = getComputedStyle(n);
            if (s.overflowY !== "visible" || s.overflowX !== "visible") return n;
        }
        return window;
    }

    function handlePosition() {
        const clipParent = getClipper(element);
        const clipRect = clipParent instanceof Window ? { top: 0, height: window.innerHeight } : clipParent.getBoundingClientRect();
        const dropdownRect = element.getBoundingClientRect();
        const optionsEl = (element.children[1] as HTMLDivElement);

        const allowedHeight = clipRect.top + clipRect.height;
        const totalHeight = dropdownRect.top + optionsEl.offsetHeight;
        if (totalHeight > allowedHeight) setIsInverted(true);
    } 

    const setupNavigation = () => {
        const Navigation = useContext(NavigationContext);
        if (!Navigation) return;
        
        let focusAnchor: null | Element;
        waitForFrames(() => focusAnchor = resolveAnchor(props.anchor));

        const openDropdown = () => {
            if (open()) collapseDropdown()
            
            if (document.activeElement === focusAnchor || document.activeElement === element) {
                toggle(true);

                spatialNavigation.add([{ area: 'dropdown-area', elements: [`.${style['dropdown-option']}`] }]);
                spatialNavigation.focusFirst('dropdown-area');
                eventBus.on('back', () => collapseDropdown())
            }
        }

        const collapseDropdown = () => {
            spatialNavigation.remove('dropdown-area');
            spatialNavigation.focusFirst('content'); // here it will be the last area
            toggle(false);
        }

        eventBus.on('select', () => openDropdown())
        // eventBus.on('move-right', () => handleMove('next'))
    }

    onMount(() => {
        setupNavigation();
        waitForFrames(handlePosition);
        if (!props.ref || !element) return;
        (props.ref as unknown as (ref: any) => void)({
            selected,
            selectOption,
            element,
        });
        
    });

    const DropdownContextValue = {
        selected, 
        selectOption, 
        open, 
        toggle, 
        registerOption, 
        unregisterOption, 
        options, 
        isInverted
    }

    return (
        <DropdownContext.Provider value={DropdownContextValue}>
            <div ref={element}
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props}
                use:forwardAttrs={props}
            >
                <DropdownTrigger parentChildren={props.children} />
                <DropdownOptions parentChildren={props.children}></DropdownOptions>
            </div>
        </DropdownContext.Provider>
    );
};

export default Object.assign(Dropdown, { Trigger, Icon, Options, Option, Track, Handle, Placeholder });