import { b as createMemo, c as createComponent, m as mergeProps } from './web.DoGxwvvO.js';
import { L as LayoutBase } from './LayoutBase.V5Pt4GTE.js';

const styles = {
	"background-image": "_background-image_1w0nx_1",
	"background-image-size-contain": "_background-image-size-contain_1w0nx_4",
	"background-image-size-cover": "_background-image-size-cover_1w0nx_7",
	"background-image-repeat-both": "_background-image-repeat-both_1w0nx_10",
	"background-image-repeat-x": "_background-image-repeat-x_1w0nx_13",
	"background-image-repeat-y": "_background-image-repeat-y_1w0nx_16",
	"background-image-position-top": "_background-image-position-top_1w0nx_19",
	"background-image-position-top-left": "_background-image-position-top-left_1w0nx_22",
	"background-image-position-top-center": "_background-image-position-top-center_1w0nx_25",
	"background-image-position-top-right": "_background-image-position-top-right_1w0nx_28",
	"background-image-position-center": "_background-image-position-center_1w0nx_31",
	"background-image-position-center-left": "_background-image-position-center-left_1w0nx_34",
	"background-image-position-center-right": "_background-image-position-center-right_1w0nx_37",
	"background-image-position-bottom": "_background-image-position-bottom_1w0nx_40",
	"background-image-position-bottom-left": "_background-image-position-bottom-left_1w0nx_43",
	"background-image-position-bottom-center": "_background-image-position-bottom-center_1w0nx_46",
	"background-image-position-bottom-right": "_background-image-position-bottom-right_1w0nx_49",
	"background-image-position-left": "_background-image-position-left_1w0nx_52",
	"background-image-position-right": "_background-image-position-right_1w0nx_55"
};

const fill = "_fill_10gyc_1";
const style = {
	fill: fill
};

const imageSizes = ["contain", "cover"];
const imageSizesSet = new Set(imageSizes);
const imageRepeat = ["both", "x", "y"];
const imageRepeatSet = new Set(imageRepeat);
const imagePosition = ["top", "center", "bottom", "top-left", "top-center", "top-right", "center-left", "center-right", "bottom-left", "bottom-center", "bottom-right", "left", "right"];
const imagePositionSet = new Set(imagePosition);
const setImageOptionStyle = (availableValues, value, style2, args) => {
  const {
    props,
    cls,
    s
  } = args;
  if (availableValues.has(value)) {
    cls.value += ` ${props.styles[`${props.classPrefix}-${style2}-${value}`]}`;
  } else {
    s[`${props.stylePrefix}-${style2}`] = value;
  }
};
const ImageBase = (props) => {
  const imageStyles = createMemo(() => {
    const cls = {
      value: `${props.styles[props.classPrefix]}`
    };
    const s = {
      [`${props.stylePrefix}-image`]: `url(${props.src})`
    };
    const args = {
      props,
      cls,
      s
    };
    if (props.fill) cls.value += ` ${style.fill}`;
    if (props.options) {
      const {
        size,
        position,
        repeat
      } = props.options;
      if (size) setImageOptionStyle(imageSizesSet, size, "size", args);
      if (position) setImageOptionStyle(imagePositionSet, position, "position", args);
      if (repeat && imageRepeatSet.has(repeat)) cls.value += ` ${props.styles[`${props.classPrefix}-repeat-${repeat}`]}`;
    }
    return {
      cls,
      s
    };
  });
  return createComponent(LayoutBase, mergeProps(props, {
    get componentClasses() {
      return imageStyles().cls.value;
    },
    get componentStyles() {
      return imageStyles().s;
    }
  }));
};

const BackgroundImage = (props) => createComponent(ImageBase, mergeProps(props, {
  styles,
  classPrefix: "background-image",
  stylePrefix: "background"
}));

export { BackgroundImage as B };
