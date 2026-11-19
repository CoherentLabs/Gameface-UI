import { Accessor, createContext, createEffect, createSignal, createUniqueId, DEV, onSettled, ParentComponent, untrack } from 'solid-js';
import { JSX } from '@solidjs/web';
import { DropdownOptions, Handle, Options, Track } from './DropdownOptions';
import { Option } from './DropdownOption';
import { DropdownTrigger, Icon, Placeholder, Trigger } from './DropdownTrigger';
import { BaseComponentRef, ComponentProps } from '@components/types/ComponentProps';
import { waitForFrames } from '@components/utils/waitForFrames';
import getScrollableParent from '@components/utils/getScrollableParent';
import baseComponent, { navigationActions } from '@components/BaseComponent/BaseComponent';
import mergeNavigationActions from '@components/utils/mergeNavigationActions';
import exposeRef from '@components/utils/exposeRef';
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

// `null` default: the parts read it optionally (pattern 1.3.o).
export const DropdownContext = createContext<DropdownContextValue | null>(null);

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
    let element: HTMLDivElement | undefined;
    const [selected, setSelected] = createSignal('');
    const [selectedValues, setSelectedValues] = createSignal<string[]>([]);
    const [open, setOpen] = createSignal(false);
    const [isInverted, setIsInverted] = createSignal(false);
    // Plain flag: the initial selection (option `selected`, initial `value`) isn't reported, as in 1.x.
    let ready = false;

    const nav = useNavigation();
    let previousNavScope: string | undefined;
    const areaID = nav && `dropdown-area-${createUniqueId()}`;

    const options = new Map<string, {label: string | JSX.Element, element: HTMLElement}>();

    // Always-up-to-date plain copies (Solid 2 stages signal writes); the signals drive rendering.
    // onChange is reported here, at the write: once per change, skipping equal values, before the
    // caller's function returns (1.x's effect ran synchronously after the write).
    let current = '';
    let currentValues: string[] = [];
    const writeSelected = (value: string) => {
        if (value === current) return;
        current = value;
        setSelected(value);
        if (ready) props.onChange?.(value);
    };
    const writeSelectedValues = (values: string[]) => {
        if (values.length === currentValues.length && values.every((v, i) => v === currentValues[i])) return;
        currentValues = values;
        setSelectedValues(values);
        if (ready) props.onChange?.(values);
    };

    const applyValue = (next: string | string[] | undefined) => {
        if (next === undefined) return;

        if (props.multiple) {
            if (!Array.isArray(next)) {
                if (DEV) console.warn(`Dropdown: Expected an array of strings for the 'value' prop when 'multiple' is true, but received:`, next);
                return;
            }

            writeSelectedValues(next.filter(v => options.has(v)));
            return;
        }

        const value = next as string;
        writeSelected(options.has(value) ? value : '');
    };

    createEffect(() => props.value, (value) => { applyValue(value); }, { defer: true });

    const registerOption = (value: string, label: string | JSX.Element, element: HTMLElement, selected?: boolean) => {
        options.set(value, {label, element});
        if (props.value !== undefined) return;

        if (selected) selectOption(value);
    };
    const unregisterOption = (value: string) => { options.delete(value); };

    const selectOption = (value: string) => {
        if (!options.has(value)) {
            if (DEV) console.warn(`Cannot select "${value}" as it is not a valid option in the dropdown.`);
            return;
        }

        if (props.multiple) {
            writeSelectedValues(
                currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value]
            );
            return;
        }

        writeSelected(value);
    }

    const deselectOption = (value: string) => {
        if (props.multiple) {
            writeSelectedValues(currentValues.filter(v => v !== value));
            return;
        }

        if (current === value) writeSelected('');
    }

    const deselectAll = () => {
        if (props.multiple) {
            writeSelectedValues([]);
            return;
        }

        writeSelected('');
    }

    const isSelected = (value: string) =>
        props.multiple ? selectedValues().includes(value) : selected() === value;

    const multiple = () => !!props.multiple;

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
        if (element && !element.contains(e.target as Node)) {
            setOpen(false);
            if (areaID) nav?.switchArea(previousNavScope!);
            document.removeEventListener('click', closeDropdown);
        }
    };

    function handlePosition() {
        if (!element) return;
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

    onSettled(() => {
        waitForFrames(() => {
            handlePosition()
        });
        // Options register in their own onSettled; apply `value` once they have.
        queueMicrotask(() => {
            untrack(() => applyValue(props.value));
            ready = true;
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
        <DropdownContext value={DropdownContextValue}>
            <div
                class={[style.dropdown, props.disabled && style['dropdown-disabled'], props.disabled && props['class-disabled'], props.class]}
                style={props.style}
                ref={[
                    (node: HTMLDivElement) => { element = node; },
                    exposeRef(props, { selected, selectedValues, selectOption, deselectOption, deselectAll, toggle }),
                    baseComponent(props),
                    navigationActions(mergeNavigationActions(props, defaultActions)),
                ]}
            >
                <DropdownTrigger parentChildren={props.children} />
                <DropdownOptions parentChildren={props.children} />
            </div>
        </DropdownContext>
    );
};

export default Object.assign(Dropdown, { Trigger, Icon, Options, Option, Track, Handle, Placeholder });
