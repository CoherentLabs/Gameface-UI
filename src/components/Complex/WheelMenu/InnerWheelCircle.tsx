import { ParentComponent, createMemo, useContext } from "solid-js";
import { useToken } from "@components/utils/tokenComponents";
import { TokenComponentProps } from "@components/types/ComponentProps";
import { InnerWheel, WheelMenuContext } from "./WheelMenu";
import styles from './WheelMenu.module.scss';
import WheelIndicator from "./WheelIndicator";

interface WheelSelectorProps extends TokenComponentProps {
}

export const InnerWheelCircle: ParentComponent<WheelSelectorProps> = (props) => {
    const innerWheelToken = useToken(InnerWheel, props.parentChildren)
    const context = useContext(WheelMenuContext);
    if (!context) {
        console.error('Wheel.InnerWheel must be used inside a WheelMenu component');
        return null;
    }

    const innerWheelClasses = createMemo(() => {
        const classes = [styles['wheel-inner']];
        classes.push(innerWheelToken()?.class ?? "");
        
        return classes.join(' ');
    });

    return (
        <div class={innerWheelClasses()} style={innerWheelToken()?.style}>
            {innerWheelToken()?.children}
            <WheelIndicator parentChildren={ props.parentChildren} />
        </div>
    )
}

export default InnerWheelCircle;