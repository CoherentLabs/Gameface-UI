import { b as createMemo, c as createComponent, m as mergeProps } from './web.DT9QqbDn.js';
import { L as LayoutBase } from './LayoutBase.DvNSSl3m.js';

function getUnit(transform) {
  if (transform === "skew" || transform === "rotate") return "deg";
  else if (transform === "translate") return "px";
  else return "";
}
function getTransformString(transformObject, transformKey) {
  let transformString = "";
  let unit = getUnit(transformKey);
  for (const axis in transformObject) {
    const value = transformObject[axis];
    transformString += ` ${transformKey}${axis.toUpperCase()}(${value}${unit})`;
  }
  return transformString;
}
function generateTransformMatrix(matrix) {
  let transformString = "";
  for (const transformKey in matrix) {
    const transformObject = matrix[transformKey];
    if (transformObject) {
      transformString += getTransformString(transformObject, transformKey);
    }
  }
  return transformString.trim();
}
function handleTransformProps(props) {
  if (props.matrix) {
    (props.translate || props.rotate || props.scale || props.skew) && console.warn("Invalid usage: The property 'matrix' shouldn't be combined with individual transform properties ('translate', 'rotate', 'scale', or 'skew'). Use either 'matrix' or the other properties individually.");
    return generateTransformMatrix(props.matrix);
  }
  if (props.translate) return getTransformString(props.translate, "translate");
  if (props.rotate) return getTransformString(props.rotate, "rotate");
  if (props.skew) return getTransformString(props.skew, "skew");
  if (props.scale) return getTransformString(props.scale, "scale");
}
function getTransformOrigin(origin) {
  return typeof origin === "string" ? origin : origin && typeof origin === "object" ? `${origin.x} ${origin.y} ${origin.z}` : "";
}
const Transform = (props) => {
  const transformString = createMemo(() => handleTransformProps(props));
  const transformOrigin = createMemo(() => getTransformOrigin(props.origin));
  const transformStyles = createMemo(() => {
    return {
      transform: transformString(),
      "transform-origin": transformOrigin()
    };
  });
  return createComponent(LayoutBase, mergeProps(props, {
    componentStyles: transformStyles
  }));
};

export { Transform as T };
