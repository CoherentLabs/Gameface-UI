import { k as createMemo, g as getNextElement, u as use, i as insert, t as template } from './web.fJ3rGgJk.js';
import { b as baseComponent } from './BaseComponent.6jspVmqg.js';

const imageSizes = ["contain", "cover"];
const imageRepeat = ["both", "x", "y"];
const imagePosition = [
  "top",
  "center",
  "bottom",
  "top-left",
  "top-center",
  "top-right",
  "center-left",
  "center-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
  "left",
  "right"
];

const image = "_image_1811p_1";
const fill = "_fill_1811p_9";
const styles = {
	image: image,
	fill: fill,
	"background-image": "_background-image_1811p_14",
	"background-image-size-contain": "_background-image-size-contain_1811p_17",
	"background-image-size-cover": "_background-image-size-cover_1811p_20",
	"background-image-repeat-both": "_background-image-repeat-both_1811p_23",
	"background-image-repeat-x": "_background-image-repeat-x_1811p_26",
	"background-image-repeat-y": "_background-image-repeat-y_1811p_29",
	"background-image-position-top": "_background-image-position-top_1811p_32",
	"background-image-position-top-left": "_background-image-position-top-left_1811p_35",
	"background-image-position-top-center": "_background-image-position-top-center_1811p_38",
	"background-image-position-top-right": "_background-image-position-top-right_1811p_41",
	"background-image-position-center": "_background-image-position-center_1811p_44",
	"background-image-position-center-left": "_background-image-position-center-left_1811p_47",
	"background-image-position-center-right": "_background-image-position-center-right_1811p_50",
	"background-image-position-bottom": "_background-image-position-bottom_1811p_53",
	"background-image-position-bottom-left": "_background-image-position-bottom-left_1811p_56",
	"background-image-position-bottom-center": "_background-image-position-bottom-center_1811p_59",
	"background-image-position-bottom-right": "_background-image-position-bottom-right_1811p_62",
	"background-image-position-left": "_background-image-position-left_1811p_65",
	"background-image-position-right": "_background-image-position-right_1811p_68",
	"mask-image": "_mask-image_1811p_72",
	"mask-image-size-contain": "_mask-image-size-contain_1811p_75",
	"mask-image-size-cover": "_mask-image-size-cover_1811p_78",
	"mask-image-repeat-both": "_mask-image-repeat-both_1811p_81",
	"mask-image-repeat-x": "_mask-image-repeat-x_1811p_84",
	"mask-image-repeat-y": "_mask-image-repeat-y_1811p_87",
	"mask-image-position-top": "_mask-image-position-top_1811p_90",
	"mask-image-position-top-left": "_mask-image-position-top-left_1811p_93",
	"mask-image-position-top-center": "_mask-image-position-top-center_1811p_96",
	"mask-image-position-top-right": "_mask-image-position-top-right_1811p_99",
	"mask-image-position-center": "_mask-image-position-center_1811p_102",
	"mask-image-position-center-left": "_mask-image-position-center-left_1811p_105",
	"mask-image-position-center-right": "_mask-image-position-center-right_1811p_108",
	"mask-image-position-bottom": "_mask-image-position-bottom_1811p_111",
	"mask-image-position-bottom-left": "_mask-image-position-bottom-left_1811p_114",
	"mask-image-position-bottom-center": "_mask-image-position-bottom-center_1811p_117",
	"mask-image-position-bottom-right": "_mask-image-position-bottom-right_1811p_120",
	"mask-image-position-left": "_mask-image-position-left_1811p_123",
	"mask-image-position-right": "_mask-image-position-right_1811p_126"
};

const imageSizesSet = new Set(imageSizes);
const imageRepeatSet = new Set(imageRepeat);
const imagePositionSet = new Set(imagePosition);
const setImageOptionStyle = (availableValues, value, style, args) => {
  const { cls, s, prefix, classPrefix } = args;
  if (availableValues.has(value)) {
    cls.push(`${styles[`${classPrefix}-${style}-${value}`]}`);
  } else {
    s[`${prefix}-${style}`] = value;
  }
};
const useImageOptions = (prefix, props) => {
  return createMemo(() => {
    const classPrefix = `${prefix}-image`;
    const cls = [];
    const s = { [`${prefix}-image`]: `url(${props.src})` };
    const args = { cls, s, prefix, classPrefix };
    if (props.options) {
      const { size, position, repeat } = props.options;
      if (size) setImageOptionStyle(imageSizesSet, size, "size", args);
      if (position) setImageOptionStyle(imagePositionSet, position, "position", args);
      if (repeat && imageRepeatSet.has(repeat)) cls.push(`${styles[`${classPrefix}-repeat-${repeat}`]}`);
    }
    return { cls: cls.join(" "), s };
  });
};

var _tmpl$ = /* @__PURE__ */ template(`<div>`);
const Image = (props) => {
  const bgOptions = props.options ? useImageOptions("background", props) : null;
  props.componentClasses = () => [bgOptions ? styles["background-image"] : styles.image, props.fill && styles.fill, bgOptions?.().cls].filter(Boolean).join(" ");
  props.componentStyles = () => {
    if (bgOptions) return bgOptions().s;
    const src = String(props.src);
    const sprite = window.__GF_ATLAS__?.[src.split("/").pop()];
    return sprite ? {
      "background-image": sprite.image,
      "background-size": sprite.size,
      "background-position": sprite.position
    } : {
      "background-image": `url(${src})`
    };
  };
  return (() => {
    var _el$ = getNextElement(_tmpl$);
    use(baseComponent, _el$, () => props);
    var _ref$ = props.ref;
    typeof _ref$ === "function" ? use(_ref$, _el$) : props.ref = _el$;
    insert(_el$, () => props.children);
    return _el$;
  })();
};

export { Image as I };
