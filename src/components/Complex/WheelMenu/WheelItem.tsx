import { Accessor, JSX, ParentComponent, ParentProps, createEffect, createMemo,on, useContext } from "solid-js";
import { useToken } from "@components/utils/tokenComponents";
import { TokenComponentProps } from "@components/types/ComponentProps";
import { ItemTokenProps, Selector, WheelMenuContext } from "./WheelMenu";
import styles from './WheelMenu.module.scss';

interface WheelSelectorProps extends TokenComponentProps{
    item: ParentProps<ItemTokenProps>
    index: Accessor<number>;
}

export const WheelItem: ParentComponent<WheelSelectorProps> = (props) => {
    const SelectorToken = useToken(Selector, props.parentChildren);
    const context = useContext(WheelMenuContext);
    if (!context) {
        console.error('Wheel.Item must be used inside a WheelMenu component');
        return null;
    }

    const rotation = createMemo(() => context.degreesPerSlice() * props.index())
    const isSelected = createMemo(() => context.selected() === props.index());
    const offset = createMemo(() => props.item.offset ?? '1vmax');

    // Subscribe to isSelected changes to trigger onChange when new item becomes selected
    createEffect(on(isSelected, (selected) => {
        if (selected && context.onChange) {
            const id = props.item.id || props.index()
            context.onChange(id);
        } 
    }, { defer: true }))

    const wrapperClasses = createMemo(() => {
        const classes = [styles['wheel-item-wrapper']];
        classes.push(props.item.class ?? "");
        isSelected() && classes.push(props.item["class-selected"] ?? "");
        
        return classes.join(' ');
    });

    const wrapperStyles = createMemo(() => {
        const styles: JSX.CSSProperties = {};
        Object.assign(styles, props.item.style);
        isSelected() && Object.assign(styles, props.item["style-selected"] ?? {});

        return styles;
    });

    const selectorClasses = createMemo(() => {
        const classes = [styles['wheel-item-selector']];
        classes.push(SelectorToken()?.class ?? "");
        if(isSelected()) {
            // Default behavior for selected state
            classes.push(styles['wheel-item-selected'])
            // Custom behavior for selected state
            classes.push(SelectorToken()?.["class-selected"] ?? "");
        }
        
        return classes.join(' ');
    });

    const selectorStyles = createMemo(() => {
        const styles: JSX.CSSProperties = {
            "clip-path": context.clipPathValue(),
            transform: `rotate(${rotation()}deg)`,
        };

        if (props.item.style) {
            Object.assign(styles, SelectorToken()?.style);
        }

        if(isSelected()) {
            Object.assign(styles, SelectorToken()?.["style-selected"] ?? {});
        }

        return styles;
    });

    return (
        // Wrapper of the item content and the clipped selector
        <div class={wrapperClasses()} style={wrapperStyles()}>
            {/* Colored part of the wheel */}
            <div class={selectorClasses()} style={selectorStyles()}></div>
            {/* Item content goes here */}
            <div class={styles['wheel-item-content']} style={{transform: `rotate(${rotation()}deg)`, "padding-top": offset() }}>
                {/* Rotated negatively to cancel out wheel rotation */}
                <div style={{transform: `rotate(-${rotation()}deg)`}}>
                    {props.item.children}
                </div>
            </div>
        </div>
    )
}

export default WheelItem;