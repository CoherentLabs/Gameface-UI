import { ParentComponent, createMemo, useContext } from "solid-js";
import { useToken } from "@components/utils/tokenComponents";
import { TokenComponentProps } from "@components/types/ComponentProps";
import { InnerWheel, WheelMenuContext } from "./WheelMenu";
import styles from './WheelMenu.module.scss';
import WheelIndicator from "./WheelIndicator";

export const InnerWheelCircle: ParentComponent<TokenComponentProps> = (props) => {
    const innerWheelToken = useToken(InnerWheel, props.parentChildren)
    const context = useContext(WheelMenuContext);
    if (!context) {
        console.error('Wheel.Content must be used inside a WheelMenu component');
        return null;
    }

    const innerWheelClasses = createMemo(() => {
        const classes = [styles['wheel-inner']];
        classes.push(innerWheelToken()?.class ?? "");
        
        return classes.join(' ');
    });

    return (
        <div class={innerWheelClasses()} style={innerWheelToken()?.style}>
            {/* Content JSX goes here */}
            {innerWheelToken()?.children}
            {/* The indicator that points to the selected item */}
            <WheelIndicator parentChildren={props.parentChildren} />
        </div>
    )
}

export default InnerWheelCircle;