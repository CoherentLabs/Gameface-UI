import { createTokenComponent, TokenBase, useTokens } from '@components/utils/tokenComponents';
import styles from './RadialMenu.module.scss';
import { ComponentProps } from '@components/types/ComponentProps';
import { Accessor, createContext, createEffect, createMemo, createSignal, For, onCleanup, ParentComponent, Setter, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import MenuItem from './MenuItem';
import MenuCenter from './MenuCenter';
import { angleToSlice, mouseToStick, Stick, stickToPolar } from './utils';
import baseComponent, { navigationActions } from '@components/BaseComponent/BaseComponent';
import exposeRef from '@components/utils/exposeRef';

export interface ItemTokenProps extends TokenBase {
    id?: string,
    offset?: string
    "class-selected"?: string,
    "style-selected"?: JSX.CSSProperties,
}
export const Item = createTokenComponent<ItemTokenProps>()
export const Indicator = createTokenComponent<TokenBase>()
export const Content = createTokenComponent<TokenBase>()
export const Icon = createTokenComponent<TokenBase>()
export const Selector = createTokenComponent<Omit<ItemTokenProps, 'id' | 'offset'>>();

interface RadialMenuContextType {
    clipPathValue: Accessor<string>,
    degreesPerSlice: Accessor<number>,
    selected: Accessor<number>,
    rotation: Accessor<number>,
}
// Null default: Solid 2 throws when a context without a default is read outside its provider.
export const RadialMenuContext = createContext<RadialMenuContextType | null>(null);

export interface RadialMenuRef {
    element: HTMLDivElement,
    open: () => void,
    close: () => void,
    opened: Accessor<boolean>,
    changeGap: Setter<number>
    selectByIndex: (index: number) => void;
    selectByVector: (x: number, y: number) => void;
}
interface RadialMenuProps extends ComponentProps {
    gap?: number,
    opened?: boolean,
    selected?: number,
    onChange?: (id: string | number) => void;
    onItemChanged?: () => void;
}

const EPS = 0.00001;

const RadialMenu: ParentComponent<RadialMenuProps> = (props) => {
    const ItemTokens = useTokens(Item, () => props.children);
    let element: HTMLDivElement | undefined;
    let eventAttached = false;

    // `selected`, `opened` and `gap` are initial values (read once, as in 1.x); later changes go through the ref.
    const initial = untrack(() => ({ selected: props.selected ?? 0, opened: props.opened ?? false, gap: props.gap ?? 0 }));
    const [selected, setSelectedSignal] = createSignal(initial.selected);
    // Always-current plain copy (Solid 2 stages signal writes). onChange is reported here, at the write,
    // once per change of the selected item (the mouse/stick re-selects the same item on every move).
    // 1.x reported it from an effect in each MenuItem.
    let currentSelected = initial.selected;
    const setSelected = (index: number) => {
        if (index === currentSelected) return;
        currentSelected = index;
        setSelectedSignal(index);
        props.onChange?.(ItemTokens()?.[index]?.id || index);
    };
    const [rotation, setRotation] = createSignal(0);
    const [isOpen, setIsOpen] = createSignal(initial.opened);
    const [gap, setGap] = createSignal(initial.gap);
    const [ignoreMouseMove, setIgnoreMouseMove] = createSignal(false);

    const length = createMemo(() => ItemTokens()?.length ?? 1);
    const degreesPerSlice = createMemo(() => 360 / length());

    const clipPathValue = createMemo(() => {
        if (length() === 1) return "";
        if (length() === 2) return 'polygon(0% 50%, 0% 0%, 100% 0%, 100% 50%)'


        const g = gap();
        const halfSliceDeg = degreesPerSlice() / 2;
        const halfSliceTan = Math.tan(halfSliceDeg * Math.PI / 180);
        const halfSliceProportion = halfSliceTan * 50;

        const xLeftPercent = 50 - halfSliceProportion + EPS + g;
        const xRightPercent = 50 + halfSliceProportion + EPS - g;
        return `polygon(${xLeftPercent}% 0, 50% 50%, ${xRightPercent}% 0)`
    });

    const mouseMoveHandler = (e: MouseEvent) => {
        if (!element || !isOpen() || ignoreMouseMove()) return;

        const rect = element.getBoundingClientRect();
        const stick = mouseToStick(e, rect);

        handleIndexSelection(stick);
    };

    const selectByVector = (x: number, y: number) => {
        if (!isOpen()) return;

        const stick = stickToPolar(x, y);
        handleIndexSelection(stick);
        // Debounce mouse move to avoid immediate override
        debounceMouseMovement();
    }

    const selectByIndex = (index: number) => {
        if (index < 0 || index >= length() || !isOpen()) return;
        const degrees = index * degreesPerSlice();

        setSelected(index)
        setRotation(degrees);
        // Debounce mouse move to avoid immediate override
        debounceMouseMovement();
    }

    /** Handles item selection based on stick input */
    const handleIndexSelection = (stick: Stick) => {
        // Deadzone for stick drift
        const DEADZONE = 0.12; // 12% allowence from center
        if (stick.mag < DEADZONE) return

        const index = angleToSlice(stick.angleDeg, degreesPerSlice());
        setSelected(index);
        setRotation(stick.angleDeg);
    }

    const debounceMouseMovement = () => {
        setIgnoreMouseMove(true);
        setTimeout(() => setIgnoreMouseMove(false), 100);
    }

    // Subscribe to isOpen changes to add/remove event listeners
    createEffect(() => isOpen(), (isOpened) => {
        if (isOpened) addEventListeners();
        else removeEventListeners();
    });

    // Subscribe to length changes to trigger onItemChanged
    createEffect(() => length(), () => {
        props.onItemChanged && props.onItemChanged()
    }, { defer: true });

    const addEventListeners = () => {
        eventAttached = true;
        window.addEventListener('mousemove', mouseMoveHandler)
    }

    const removeEventListeners = () => {
        if (!eventAttached) return;

        eventAttached = false;
        window.removeEventListener('mousemove', mouseMoveHandler)
    }

    onCleanup(() => removeEventListeners());

    const ContextObj = {
        clipPathValue,
        degreesPerSlice,
        selected,
        rotation,
    }

    return (
        <RadialMenuContext value={ContextObj}>
            <div
                class={[styles.menu, isOpen() && styles["menu-open"], props.class]}
                style={props.style}
                ref={[
                    (el: HTMLDivElement) => { element = el; },
                    exposeRef<Omit<RadialMenuRef, 'element'>>(props, {
                        open: () => setIsOpen(true),
                        close: () => setIsOpen(false),
                        opened: () => isOpen(),
                        changeGap: setGap,
                        selectByIndex,
                        selectByVector
                    }),
                    baseComponent(props),
                    navigationActions({
                        anchor: props.anchor,
                        ...props.onAction,
                    }),
                ]}
            >
                {/* Content */}
                <MenuCenter parentChildren={props.children} />
                {/* Items */}
                <For each={ItemTokens()}>
                    {(token, index) => <MenuItem index={index} item={token} parentChildren={props.children}></MenuItem>}
                </For>
            </div>
        </RadialMenuContext>
    )
}

export default Object.assign(RadialMenu, { Item, Content, Selector, Indicator: Object.assign(Indicator, { Icon }) });
