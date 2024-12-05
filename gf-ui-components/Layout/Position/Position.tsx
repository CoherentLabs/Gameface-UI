import { ParentComponent } from "solid-js";
import styles from './Position.module.css';
import LayoutBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";

interface Position extends LayoutBaseProps {
    top?: boolean,
    left?: boolean,
    right?: boolean,
    bottom?: boolean,
    center?: boolean,
}

const assignPositionClasses = (props: Position) => {
    let position = [styles.Position];

    if(props.top) position.push(styles.top);
    if(props.bottom) position.push(styles.bottom);
    if(props.left) position.push(styles.left);
    if(props.right) position.push(styles.right);
    if(props.top && props.center) position.push(styles['top-center']);
    if(props.bottom && props.center) position.push(styles['bottom-center']);
    if(props.left && props.center) position.push(styles['left-center']);
    if(props.right && props.center) position.push(styles['right-center']);
    if(props.center && !props.top && !props.bottom && !props.left && !props.right) position.push(styles.center);

    return position
}

const Position: ParentComponent<Position> = (props) => {
    return <LayoutBase {...props} componentClasses={assignPositionClasses(props).join(' ')} />
}

export default Position;