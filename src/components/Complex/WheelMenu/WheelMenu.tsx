import { createTokenComponent, TokenBase, useToken, useTokens } from '@components/utils/tokenComponents';
import styles from './WheelMenu.module.scss';
import { ComponentProps } from '@components/types/ComponentProps';
import { Accessor, createContext, createEffect, createMemo, createSignal, For, JSX, on, onCleanup, onMount, ParentComponent, Setter } from 'solid-js';
import WheelItem from './WheelItem';
import useBaseComponent from '@components/BaseComponent/BaseComponent';
import InnerWheelCircle from './InnerWheelCircle';
export interface ItemTokenProps extends TokenBase {
    id?: string,
    offset?: string
    "class-selected"?: string,
    "style-selected"?: JSX.CSSProperties,
}
export const Item = createTokenComponent<ItemTokenProps>()
export const Indicator = createTokenComponent<TokenBase>()
export const InnerWheel = createTokenComponent<TokenBase>()
export const Icon = createTokenComponent<TokenBase>()
export const Selector = createTokenComponent<Omit<ItemTokenProps, 'id'>>();

interface WheelMenuContextType {
    clipPathValue: Accessor<string>,
    degreesPerSlice: Accessor<number>, 
    selected:  Accessor<number>,
    rotation:  Accessor<number>,
    onChange?: (id: string | number) => void;
}
export const WheelMenuContext = createContext<WheelMenuContextType>();

export interface WheelMenuRef {
    element: HTMLDivElement,
    open: () => void,
    close: () => void,
    changeGap: Setter<boolean>
    select: (index: number) => void;
}
interface WheelNenuProps extends ComponentProps {
    gap?: number, 
    opened?: boolean,
    onChange?: (id: string | number) => void;
    onItemChanged?: () => void;
}

const WheelMenu: ParentComponent<WheelNenuProps> = (props) => {
    const ItemTokens = useTokens(Item, props.children);
    let wheelElement: HTMLDivElement | undefined;
    
    const [selected, setSelected] = createSignal(0);
    const [rotation, setRotation] = createSignal(0);
    const [isOpen, setIsOpen] = createSignal(props.opened ?? false);
    const [gap, setGap] = createSignal(props.gap ?? 0);
    const [ignoreMouseMove, setIgnoreMouseMove] = createSignal(false);

    const length = createMemo(() => ItemTokens()?.length ?? 1);
    const degreesPerSlice = createMemo(() => 360 / length());
    const clipPathValue = createMemo(() => {
        if (length() === 1) return "";
        if (length() === 2) return 'polygon(0% 50%, 0% 0%, 100% 0%, 100% 50%)'

        const eps = 0.00001;
        const g = gap();
        const halfSliceDeg = degreesPerSlice() / 2;
        const halfSliceTan = Math.tan(halfSliceDeg * Math.PI / 180);
        const halfSliceProportion = halfSliceTan * 50;

        const xLeftPercent = 50 - halfSliceProportion + eps + g;
        const xRightPercent = 50 + halfSliceProportion + eps - g;
        return `polygon(${xLeftPercent}% 0, 50% 50%, ${xRightPercent}% 0)`
    });

    const getSelectedSector = (e: MouseEvent) => {
        if (!wheelElement && !isOpen() || ignoreMouseMove()) return;

        const wheelRect = wheelElement!.getBoundingClientRect()
        const cx = wheelRect.left + wheelRect.width / 2;
        const cy = wheelRect.top + wheelRect.height / 2;
        
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;

        const rad = Math.atan2(dx, -dy); // swap, flip Y → 0° is up, clockwise positive
        const degrees = (rad * 180 / Math.PI + 360) % 360; // normalize to [0, 360)
        const slice = degreesPerSlice()
        const index = Math.floor(((degrees + (slice / 2)) % 360) / slice); // divide by 2 to shift half a sector

        setSelected(index)
        setRotation(degrees);
    }

    const wheelMenuClasses = createMemo(() => {
        const classes = [styles.wheel];
        if (isOpen()) classes.push(styles["wheel-open"]);

        return classes.join(' ');
    })

    const selectItem = (index: number) => {
        if (index < 0 || index >= length()) return;
        const degrees = index * degreesPerSlice();

        setSelected(index)
        setRotation(degrees);
        // Debounce mouse move to avoid immediate override
        setIgnoreMouseMove(true);
        setTimeout(() => setIgnoreMouseMove(false), 100);
    }

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
        window.addEventListener('mousemove', getSelectedSector)
    }

    const removeEventListeners = () => {
        window.removeEventListener('mousemove', getSelectedSector)
    }

    onMount(() => {
        if (!props.ref || !wheelElement) return;
    
        (props.ref as unknown as (ref: any) => void)({
            element: wheelElement,
            open: () => setIsOpen(true),
            close: () => setIsOpen(false),
            changeGap: setGap,
            select: selectItem
        });
    })

    onCleanup(() => removeEventListeners());

    props.componentClasses = () => wheelMenuClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    const ContextObj = {
        clipPathValue, 
        degreesPerSlice, 
        selected, 
        rotation, 
        onChange: props.onChange
    }
    
    return (
        <WheelMenuContext.Provider value={ContextObj}>
            <div 
                ref={wheelElement!}
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props} 
                use:forwardAttrs={props} >
                {/* Content */}
                <InnerWheelCircle parentChildren={props.children} />
                {/* Items */}
                <For each={ItemTokens()}>
                    {(token, index) => <WheelItem index={index} item={token} parentChildren={props.children}></WheelItem>}
                </For>
            </div>
        </WheelMenuContext.Provider>
    )
}

export default Object.assign(WheelMenu, { Item, Content: InnerWheel, Selector, Indicator: Object.assign(Indicator, {Icon}) });