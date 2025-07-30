import { Accessor, createContext, createMemo, createSignal, DEV, JSX, onMount, ParentComponent } from 'solid-js';
import style from './Dropdown.module.scss';
import { DropdownOptions, Handle, Options, Track } from './DropdownOptions';
import { Option } from './DropdownOption';
import { DropdownTrigger, Icon, Placeholder, Trigger } from './DropdownTrigger';
import { BaseComponentRef, ComponentProps } from '@components/types/ComponentProps';
import useBaseComponent from '@components/BaseComponent/BaseComponent';

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
    registerOption: (value: string, selected?: boolean) => void
    unregisterOption: (value: string) => void
}

interface DropdownProps extends ComponentProps {
    disabled?: boolean
    'class-disabled'?: string
    onChange?: (value: string) => void;
}

const Dropdown: ParentComponent<DropdownProps> = (props) => {
    let element!: HTMLDivElement;
    const [selected, setSelected] = createSignal('');
    const [open, setOpen] = createSignal(false);
    const options = new Set();
    const registerOption = (value: string, selected?: boolean) => {
        options.add(value);
        if (selected) selectOption(value);
    };
    const unregisterOption = (value: string) => options.delete(value);

    const selectOption = (value: string) => {
        if (!options.has(value)) {
            if (DEV) console.warn(`Cannot select "${value}" as it is not a valid option in the dropdown.`);
            return;
        }

        setSelected(value);
        props.onChange?.(selected());
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

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            selected,
            selectOption,
            element,
        });
    });

    return (
        <DropdownContext.Provider value={{ selected, selectOption, open, toggle, registerOption, unregisterOption }}>
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