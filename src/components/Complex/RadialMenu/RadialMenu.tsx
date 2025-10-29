import { createTokenComponent, TokenBase, useTokens } from '@components/utils/tokenComponents';
import styles from './RadialMenu.module.scss';
import { ComponentProps } from '@components/types/ComponentProps';
import { Accessor, createContext, createEffect, createMemo, createSignal, For, JSX, on, onCleanup, onMount, ParentComponent, Setter } from 'solid-js';
import MenuItem from './MenuItem';
import useBaseComponent from '@components/BaseComponent/BaseComponent';
import MenuCenter from './MenuCenter';
import { angleToSlice, mouseToStick, Stick, stickToPolar } from './utils';
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
    selected:  Accessor<number>,
    rotation:  Accessor<number>,
    onChange?: (id: string | number) => void;
}
export const RadialMenuContext = createContext<RadialMenuContextType>();

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
    const ItemTokens = useTokens(Item, props.children);
    let element: HTMLDivElement | undefined;
    let eventAttached = false;
    
    const [selected, setSelected] = createSignal(props.selected ?? 0);
    const [rotation, setRotation] = createSignal(0);
    const [isOpen, setIsOpen] = createSignal(props.opened ?? false);
    const [gap, setGap] = createSignal(props.gap ?? 0);
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

    const radialMenuClasses = createMemo(() => {
        const classes = [styles.menu];
        if (isOpen()) classes.push(styles["menu-open"]);

        return classes.join(' ');
    })

    // Subscribe to isOpen changes to add/remove event listeners
    createEffect(on(isOpen, (isOpened) => {
        if (isOpened) addEventListeners();
        else removeEventListeners();
    }))

    // Subscribe to length changes to trigger onItemChanged
    createEffect(on(length, () => {
        props.onItemChanged && props.onItemChanged()
    }, { defer: true }))

    const addEventListeners = () => {
        eventAttached = true;
        window.addEventListener('mousemove', mouseMoveHandler)
    }

    const removeEventListeners = () => {
        if (!eventAttached) return;
        
        eventAttached = false;
        window.removeEventListener('mousemove', mouseMoveHandler)
    }

    onMount(() => {
        if (!props.ref || !element) return;
    
        (props.ref as unknown as (ref: any) => void)({
            element: element,
            open: () => setIsOpen(true),
            close: () => setIsOpen(false),
            opened: () => isOpen(),
            changeGap: setGap,
            selectByIndex,
            selectByVector
        });
    })

    onCleanup(() => removeEventListeners());

    props.componentClasses = () => radialMenuClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    const ContextObj = {
        clipPathValue, 
        degreesPerSlice, 
        selected, 
        rotation,
        onChange: props.onChange
    }
    
    return (
        <RadialMenuContext.Provider value={ContextObj}>
            <div 
                ref={element!}
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props} 
                use:forwardAttrs={props} >
                {/* Content */}
                <MenuCenter parentChildren={props.children} />
                {/* Items */}
                <For each={ItemTokens()}>
                    {(token, index) => <MenuItem index={index} item={token} parentChildren={props.children}></MenuItem>}
                </For>
            </div>
        </RadialMenuContext.Provider>
    )
}

export default Object.assign(RadialMenu, { Item, Content, Selector, Indicator: Object.assign(Indicator, {Icon}) });