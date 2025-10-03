import { Accessor, JSX, ParentComponent, ParentProps, Show, createMemo, onCleanup, onMount, useContext } from "solid-js";
import { TokenBase, useToken } from "@components/utils/tokenComponents";
import { TokenComponentProps } from "@components/types/ComponentProps";
import { Item, WheelMenuContext } from "./WheelMenu";
import styles from './WheelMenu.module.scss';

interface WheelSelectorProps {
    item: ParentProps<TokenBase>
    index: Accessor<number>;
}

export const WheelItem: ParentComponent<WheelSelectorProps> = (props) => {
    const context = useContext(WheelMenuContext);
    if (!context) {
        console.error('Wheel.Item must be used inside a WheelMenu component');
        return null;
    }

    const rotation = createMemo(() => context.degreesPerSlice() * props.index())
    const isSelected = createMemo(() => context.selected() === props.index());

    const itemClasses = createMemo(() => {
        const classes = [styles['wheel-item']];
        classes.push(props.item.class ?? "");
        if(isSelected()) classes.push(styles['wheel-item-selected'])
        
        return classes.join(' ');
    });

    const itemStyles = createMemo(() => {
        const styles: JSX.CSSProperties = {
            "clip-path": context.clipPathValue(),
            transform: `rotate(${rotation()}deg)`,
        };

        if (props.item.style) {
            Object.assign(styles, props.item.style);
        }

        return styles;
    });

    return (
        <>
            <div class={itemClasses()} style={itemStyles()}></div>
            <div class={styles['wheel-item-content']} style={{transform: `rotate(${rotation()}deg)`}}>
                <div style={{transform: `rotate(-${rotation()}deg)`}}>
                    {props.item.children}
                </div>
            </div>
        </>
    )
}

export default WheelItem;