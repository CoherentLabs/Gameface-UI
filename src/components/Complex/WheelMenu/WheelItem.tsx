import { Accessor, JSX, ParentComponent, ParentProps, Show, createEffect, createMemo, on, onCleanup, onMount, useContext } from "solid-js";
import { TokenBase, useToken } from "@components/utils/tokenComponents";
import { TokenComponentProps } from "@components/types/ComponentProps";
import { Item, ItemTokenProps, WheelMenuContext } from "./WheelMenu";
import styles from './WheelMenu.module.scss';

interface WheelSelectorProps {
    item: ParentProps<ItemTokenProps>
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

    // Subscribe to isSelected changes to trigger onChange when new item becomes selected
    createEffect(on(isSelected, (selected) => {
        if (selected && context.onChange) {
            const id = props.item.id || props.index()
            context.onChange(id);
        } 
    }, { defer: true }))

    const itemClasses = createMemo(() => {
        const classes = [styles['wheel-item']];
        classes.push(props.item.class ?? "");
        if(isSelected()) {
            classes.push(styles['wheel-item-selected'])
            classes.push(props.item["class-selected"] ?? "");
        }
        
        return classes.join(' ');
    });

    const itemStyles = createMemo(() => {
        const styles: JSX.CSSProperties = {
            "clip-path": context.clipPathValue(),
            transform: `rotate(${rotation()}deg)`,
        };

        if(isSelected()) {
            Object.assign(styles, props.item["style-selected"] ?? {});
        }

        if (props.item.style) {
            Object.assign(styles, props.item.style);
        }

        return styles;
    });

    return (
        <>
            {/* Colored part of the wheel */}
            <div class={itemClasses()} style={itemStyles()}></div>
            {/* Item content goes here */}
            <div class={styles['wheel-item-content']} style={{transform: `rotate(${rotation()}deg)`}}>
                {/* Rotated negatively to cancel out wheel rotation */}
                <div style={{transform: `rotate(-${rotation()}deg)`}}>
                    {props.item.children}
                </div>
            </div>
        </>
    )
}

export default WheelItem;