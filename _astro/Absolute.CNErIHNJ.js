import { f as createMemo, c as createComponent, m as mergeProps } from './web.bikURqO-.js';
import { L as LayoutBase } from './LayoutBase.Crrr9d-c.js';

const absolute = "_absolute_cecs8_1";
const center = "_center_cecs8_5";
const styles = {
	absolute: absolute,
	center: center,
	"center-x": "_center-x_cecs8_10",
	"center-y": "_center-y_cecs8_14"
};

const Absolute = (props) => {
  const positionStyle = createMemo(() => {
    return {
      top: props.top,
      left: props.left,
      right: props.right,
      bottom: props.bottom
    };
  });
  const absoluteClasses = createMemo(() => {
    const base = [styles.absolute];
    const center = props.center;
    if (center) {
      base.push(typeof center === "boolean" ? styles.center : styles[`center-${center.toLowerCase()}`]);
    }
    return base.join(" ");
  });
  return createComponent(LayoutBase, mergeProps(props, {
    componentClasses: absoluteClasses,
    componentStyles: positionStyle
  }));
};

export { Absolute as A };
