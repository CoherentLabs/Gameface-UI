import { Accessor, createContext, createEffect, createMemo, createSignal, createUniqueId, DEV, JSX, on, onMount, ParentComponent } from 'solid-js';
import { DropdownOptions, Handle, Options, Track } from './DropdownOptions';
import { Option } from './DropdownOption';
import { DropdownTrigger, Icon, Placeholder, Trigger } from './DropdownTrigger';
import { BaseComponentRef, ComponentProps } from '@components/types/ComponentProps';
import { waitForFrames } from '@components/utils/waitForFrames';
import getScrollableParent from '@components/utils/getScrollableParent';
import baseComponent, { navigationActions } from '@components/BaseComponent/BaseComponent';
import mergeNavigationActions from '@components/utils/mergeNavigationActions';
import { useNavigation } from '@components/Utility/Navigation/Navigation';
import style from './Dropdown.module.scss';
export interface CommonDropdownSlotProps {
    style?: JSX.CSSProperties,
    class?: string,
}

export interface DropdownRef extends BaseComponentRef {
    selected: Accessor<string>;
    selectedValues: Accessor<string[]>;
    selectOption: (value: string) => void
    deselectOption: (value: string) => void
    deselectAll: () => void
    toggle: (isOpened: boolean) => void
}

export const DropdownContext = createContext<DropdownContextValue>();

interface DropdownContextValue {
    selected: Accessor<string>;
    selectedValues: Accessor<string[]>;
    isSelected: (value: string) => boolean;
    multiple: Accessor<boolean>;
    selectOption: (value: string) => void
    open: Accessor<boolean>;
    toggle: (isOpened: boolean) => void;
    registerOption: (value: string, label: string | JSX.Element, element: HTMLElement, selected?: boolean) => void
    unregisterOption: (value: string) => void,
    handleNavigationClose: () => void,
    options: Map<string, {label: string | JSX.Element, element: HTMLElement}>,
    isInverted: Accessor<boolean>
}

interface DropdownProps extends ComponentProps {
    value?: string | string[],
    disabled?: boolean
    'class-disabled'?: string
    multiple?: boolean
    onChange?: (value: string | string[]) => void;
}

const Dropdown: ParentComponent<DropdownProps> = (props) => {
    let element!: HTMLDivElement;
    const [selected, setSelected] = createSignal('');
    const [selectedValues, setSelectedValues] = createSignal<string[]>([]);
    const [open, setOpen] = createSignal(false);
    const [isInverted, setIsInverted] = createSignal(false);
    const [ready, setReady] = createSignal(false);
    
    const nav = useNavigation();
    let previousNavScope: string | undefined;
    const areaID = nav && `dropdown-area-${createUniqueId()}`;

    const options = new Map<string, {label: string | JSX.Element, element: HTMLElement}>();

    createEffect(on(
        () => props.multiple ? selectedValues() : selected(),
        (next) => { if (ready()) props.onChange?.(next); },
    { defer: true } ));

    const applyValue = (next: string | string[] | undefined) => {
        if (next === undefined) return;

        if (props.multiple) {
            if (!Array.isArray(next)) {
                if (DEV) console.warn(`Dropdown: Expected an array of strings for the 'value' prop when 'multiple' is true, but received:`, next);
                return;
            }

            setSelectedValues((prev) => {
                if (prev.length === next.length && prev.every((v, i) => v === next[i])) return prev;

                return next.filter(v => options.has(v));
            })
            return;
        }

        const value = next as string;
        setSelected(options.has(value) ? value : '');
    };

    createEffect(on(() => props.value, applyValue, { defer: true }));

    const registerOption = (value: string, label: string | JSX.Element, element: HTMLElement, selected?: boolean) => {
        options.set(value, {label, element});
        if (props.value !== undefined) return; 

        if (selected) selectOption(value);
    };
    const unregisterOption = (value: string) => options.delete(value);

    const selectOption = (value: string) => {
        if (!options.has(value)) {
            if (DEV) console.warn(`Cannot select "${value}" as it is not a valid option in the dropdown.`);
            return;
        }

        if (props.multiple) {
            setSelectedValues(prev =>
                prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
            );
            return;
        }

        setSelected(value);
    }

    const deselectOption = (value: string) => {
        if (props.multiple) {
            setSelectedValues(prev => prev.filter(v => v !== value));
            return;
        }

        if (selected() === value) {
            setSelected('');
        }
    }

    const deselectAll = () => {
        if (props.multiple) {
            if (selectedValues().length === 0) return;
            setSelectedValues([]);
            return;
        }

        if (selected() === '') return;
        setSelected('');
    }

    const isSelected = (value: string) =>
        props.multiple ? selectedValues().includes(value) : selected() === value;

    const multiple = () => !!props.multiple;

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
            initOptionsArea();
            setOpen(true);
            return;
        }

        setOpen(false);
        document.removeEventListener('click', closeDropdown);
        deinitOptionsArea();
    }

    const closeDropdown = (e: MouseEvent) => {
        if (!element.contains(e.target as Node)) {
            setOpen(false);
            if (areaID) nav?.switchArea(previousNavScope!);
            document.removeEventListener('click', closeDropdown);
        }
    };

    props.componentClasses = () => dropdownClasses();

    function handlePosition() {
        const clipParent = getScrollableParent(element);
        const clipRect = !clipParent ? { top: 0, height: window.innerHeight } : clipParent.getBoundingClientRect();
        const dropdownRect = element.getBoundingClientRect();
        const optionsEl = (element.children[1] as HTMLDivElement);

        const allowedHeight = clipRect.top + clipRect.height;
        const totalHeight = dropdownRect.top + optionsEl.offsetHeight;
        if (totalHeight > allowedHeight) setIsInverted(true);
    }

    const initOptionsArea = () => {
        if (!nav || !areaID ) return;
        setTimeout(() => nav.registerArea(areaID, [...options.values()].map(o => o.element) , true))
    }

    const deinitOptionsArea = () => {
        if (!nav || !areaID) return;
        nav.unregisterArea(areaID);
    }

    const handleNavigationOpen = () => {
        if (!open()) {
            toggle(true);
            previousNavScope = nav?.getScope();
        }
    }

    const handleNavigationClose = () => {
        if (!open()) return;
        
        toggle(false);
        nav?.switchArea(previousNavScope!);
    }

    onMount(() => {
        waitForFrames(() => {
            handlePosition()
        });
        queueMicrotask(() => {
            applyValue(props.value);
            setReady(true);
        });
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            selected,
            selectedValues,
            selectOption,
            deselectOption,
            deselectAll,
            toggle,
            element,
        });
    });

    const DropdownContextValue = {
        selected,
        selectedValues,
        isSelected,
        multiple,
        selectOption,
        open,
        toggle,
        registerOption,
        unregisterOption,
        handleNavigationClose,
        options,
        isInverted
    }

    const defaultActions = {
        'select': handleNavigationOpen,
        'back': handleNavigationClose,
    }

    return (
        <DropdownContext.Provider value={DropdownContextValue}>
            <div ref={element}
                use:baseComponent={props}
                use:navigationActions={mergeNavigationActions(props, defaultActions)}
            >
                <DropdownTrigger parentChildren={props.children} />
                <DropdownOptions parentChildren={props.children}></DropdownOptions>
            </div>
        </DropdownContext.Provider>
    );
};

export default Object.assign(Dropdown, { Trigger, Icon, Options, Option, Track, Handle, Placeholder });