import { o as onMount, b as createMemo, c as createComponent, m as mergeProps } from './web.DT9QqbDn.js';
import { L as LayoutBase } from './LayoutBase.DvNSSl3m.js';
import { w as warnIfUnsupported } from './supportsGamefaceFeature.ByqsM1VI.js';

const flex = "_flex_1qwo4_1";
const styles = {
	flex: flex,
	"flex-row": "_flex-row_1qwo4_4",
	"flex-row-reverse": "_flex-row-reverse_1qwo4_7",
	"flex-column": "_flex-column_1qwo4_10",
	"flex-column-reverse": "_flex-column-reverse_1qwo4_13",
	"flex-wrap": "_flex-wrap_1qwo4_16",
	"flex-wrap-reverse": "_flex-wrap-reverse_1qwo4_19",
	"flex-nowrap": "_flex-nowrap_1qwo4_22",
	"flex-justify-start": "_flex-justify-start_1qwo4_25",
	"flex-justify-center": "_flex-justify-center_1qwo4_28",
	"flex-justify-end": "_flex-justify-end_1qwo4_31",
	"flex-justify-space-between": "_flex-justify-space-between_1qwo4_34",
	"flex-justify-space-around": "_flex-justify-space-around_1qwo4_37",
	"flex-align-start": "_flex-align-start_1qwo4_40",
	"flex-align-center": "_flex-align-center_1qwo4_43",
	"flex-align-end": "_flex-align-end_1qwo4_46",
	"flex-align-stretch": "_flex-align-stretch_1qwo4_49",
	"flex-content-end": "_flex-content-end_1qwo4_52",
	"flex-content-stretch": "_flex-content-stretch_1qwo4_55"
};

const Flex = (props) => {
  onMount(() => warnIfUnsupported(props, "gap"));
  const classes = createMemo(() => {
    const flexClasses = [styles.flex];
    if (props.direction) flexClasses.push(styles[`flex-${props.direction}`]);
    if (props.wrap) flexClasses.push(styles[`flex-${props.wrap}`]);
    if (props["justify-content"]) flexClasses.push(styles[`flex-justify-${props["justify-content"]}`]);
    if (props["align-items"]) flexClasses.push(styles[`flex-align-${props["align-items"]}`]);
    if (props["align-content"]) flexClasses.push(styles[`flex-content-${props["align-content"]}`]);
    return flexClasses.join(" ");
  });
  const gapStyles = createMemo(() => ({
    gap: props.gap,
    "row-gap": props["row-gap"],
    "column-gap": props["column-gap"]
  }));
  return createComponent(LayoutBase, mergeProps(props, {
    get componentClasses() {
      return classes();
    },
    get componentStyles() {
      return gapStyles();
    }
  }));
};

export { Flex as F };
