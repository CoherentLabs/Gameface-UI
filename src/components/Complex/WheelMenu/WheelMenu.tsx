import { createTokenComponent, TokenBase, useToken, useTokens } from '@components/utils/tokenComponents';
import styles from './WheelMenu.module.scss';
import { ComponentProps } from '@components/types/ComponentProps';
import { Accessor, createContext, createMemo, createSignal, For, onCleanup, onMount, ParentComponent } from 'solid-js';
import WheelItem from './WheelItem';
import useBaseComponent from '@components/BaseComponent/BaseComponent';
import InnerWheelCircle from './InnerWheelCircle';

export const Item = createTokenComponent<TokenBase>()
export const Indicator = createTokenComponent<TokenBase>()
export const InnerWheel = createTokenComponent<TokenBase>()
export const Icon = createTokenComponent<TokenBase>()

interface WheelMenuContextType {
    clipPathValue: Accessor<string>,
    degreesPerSlice: Accessor<number>, 
    selected:  Accessor<number>,
    rotation:  Accessor<number>
}
export const WheelMenuContext = createContext<WheelMenuContextType>();

interface WheelNenuProps extends ComponentProps {
    onChange?: (title: string) => void;
}

const WheelMenu: ParentComponent<WheelNenuProps> = (props) => {
    const ItemTokens = useTokens(Item, props.children);
    let wheelElement: HTMLDivElement | undefined;
    
    const [selected, setSelected] = createSignal(0);
    const [rotation, setRotation] = createSignal(0);
    const [gap, setGap] = createSignal(0);

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
        if (!wheelElement) return;

        const wheelRect = wheelElement.getBoundingClientRect()
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

    onMount(() => {
        window.addEventListener('mousemove', getSelectedSector)

        if (!props.ref || !wheelElement) return;
    
        (props.ref as unknown as (ref: any) => void)({
            element: wheelElement,
        });
    })

    onCleanup(() => {
        window.removeEventListener('mousemove', getSelectedSector)
    })

    props.componentClasses = () => styles.wheel;
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    return (
        <WheelMenuContext.Provider value={{ clipPathValue, degreesPerSlice, selected, rotation }}>
            <div 
                ref={wheelElement!}
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props} 
                use:forwardAttrs={props} >
                <InnerWheelCircle parentChildren={props.children} />
                <For each={ItemTokens()}>
                    {(token, index) => <WheelItem index={index} item={token}></WheelItem>}
                </For>
            </div>
        </WheelMenuContext.Provider>
    )
}

export default Object.assign(WheelMenu, { Item, Content: InnerWheel, Indicator: Object.assign(Indicator, {Icon}) });