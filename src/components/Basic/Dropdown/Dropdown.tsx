import { Accessor, createContext, createMemo, createSignal, createUniqueId, DEV, JSX, onMount, ParentComponent } from 'solid-js';
import { DropdownOptions, Handle, Options, Track } from './DropdownOptions';
import { Option } from './DropdownOption';
import { DropdownTrigger, Icon, Placeholder, Trigger } from './DropdownTrigger';
import { BaseComponentRef, ComponentProps } from '@components/types/ComponentProps';
import useBaseComponent from '@components/BaseComponent/BaseComponent';
import { waitForFrames } from '@components/utils/waitForFrames';
import getScrollableParent from '@components/utils/getScrollableParent';
import mergeNavigationActions from '@components/utils/mergeNavigationActions';
import { useNavigation } from '@components/Utility/Navigation/Navigation';
import style from './Dropdown.module.scss';
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
    registerOption: (value: string, label: string | JSX.Element, element: HTMLElement, selected?: boolean) => void
    unregisterOption: (value: string) => void,
    handleNavigationClose: () => void,
    options: Map<string, {label: string | JSX.Element, element: HTMLElement}>,
    isInverted: Accessor<boolean>
}

interface DropdownProps extends ComponentProps {
    disabled?: boolean
    'class-disabled'?: string
    onChange?: (value: string) => void;
}

const Dropdown: ParentComponent<DropdownProps> = (props) => {
    let element!: HTMLDivElement;
    const [selected, setSelected] = createSignal('');
    const [firstRender, setFirstRender] = createSignal(true);
    const [open, setOpen] = createSignal(false);
    const [isInverted, setIsInverted] = createSignal(false);
    
    const [anchorEl, setAnchorEl] = createSignal<HTMLElement | null>(null);
    const nav = useNavigation();
    let areaID = nav && `dropdown-area-${createUniqueId()}`;

    const options = new Map<string, {label: string | JSX.Element, element: HTMLElement}>();

    const registerOption = (value: string, label: string | JSX.Element, element: HTMLElement, selected?: boolean) => {
        options.set(value, {label, element});
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

        if (!nav) {
            classes.push(style['hover-only']);
            console.log('eo')
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
            document.removeEventListener('mousedown', closeDropdown);
        }
    };

    props.componentClasses = () => dropdownClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs, navigationActions } = useBaseComponent(props);

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
        if (!open()) toggle(true);
    }

    const handleNavigationClose = () => {
        if (!open()) return;
        
        toggle(false);

        // focus back
        const anchor = anchorEl();
        anchor ? (anchor as HTMLElement).focus() : element.focus();
    }

    onMount(() => {
        waitForFrames(() => {
            handlePosition()
            if (props.anchor) {
                const el = typeof props.anchor === 'string'
                  ? document.querySelector(props.anchor)
                  : props.anchor;
                setAnchorEl(el as HTMLElement);
            }
        });
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
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props}
                use:forwardAttrs={props}
                use:navigationActions={mergeNavigationActions(props, defaultActions)}
            >
                <DropdownTrigger parentChildren={props.children} />
                <DropdownOptions parentChildren={props.children}></DropdownOptions>
            </div>
        </DropdownContext.Provider>
    );
};

export default Object.assign(Dropdown, { Trigger, Icon, Options, Option, Track, Handle, Placeholder });