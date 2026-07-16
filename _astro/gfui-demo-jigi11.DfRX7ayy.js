import { a as createSignal, b as createMemo, o as onMount, g as getNextElement, v as getNextMarker, u as use, i as insert, c as createComponent, p as createRenderEffect, q as className, G as setStyleProperty, t as template, r as render } from './web.e96V-LtU.js';
import { X as XYSlider$1 } from './XYSlider.DVHyoOTO.js';
import { S as Slider } from './Slider.0ccu2F5m.js';
import { S as Segment } from './Segment.DmLWvjZT.js';
import { n as navigationActions, b as baseComponent } from './BaseComponent.BmESB2kC.js';
import { T as TextInput } from './TextInput.Dgj6M20d.js';
import './clamp.BBPiOs3-.js';
import './tokenComponents.hFDI9VqW.js';
import '@solid-primitives/jsx-tokenizer';
import './mergeNavigationActions.C3r_vRJZ.js';
import './stopPropagation.CarT97-u.js';
import 'coherent-gameface-interaction-manager';
import './store.CBj67zxW.js';
import './TextInput.module.C2A3P8WC.js';
import './AddonSlot.D6ei6DLz.js';

const hexTransperancies = {
  100: "FF",
  99: "FC",
  98: "FA",
  97: "F7",
  96: "F5",
  95: "F2",
  94: "F0",
  93: "ED",
  92: "EB",
  91: "E8",
  90: "E6",
  89: "E3",
  88: "E0",
  87: "DE",
  86: "DB",
  85: "D9",
  84: "D6",
  83: "D4",
  82: "D1",
  81: "CF",
  80: "CC",
  79: "C9",
  78: "C7",
  77: "C4",
  76: "C2",
  75: "BF",
  74: "BD",
  73: "BA",
  72: "B8",
  71: "B5",
  70: "B3",
  69: "B0",
  68: "AD",
  67: "AB",
  66: "A8",
  65: "A6",
  64: "A3",
  63: "A1",
  62: "9E",
  61: "9C",
  60: "99",
  59: "96",
  58: "94",
  57: "91",
  56: "8F",
  55: "8C",
  54: "8A",
  53: "87",
  52: "85",
  51: "82",
  50: "80",
  49: "7D",
  48: "7A",
  47: "78",
  46: "75",
  45: "73",
  44: "70",
  43: "6E",
  42: "6B",
  41: "69",
  40: "66",
  39: "63",
  38: "61",
  37: "5E",
  36: "5C",
  35: "59",
  34: "57",
  33: "54",
  32: "52",
  31: "4F",
  30: "4D",
  29: "4A",
  28: "47",
  27: "45",
  26: "42",
  25: "40",
  24: "3D",
  23: "3B",
  22: "38",
  21: "36",
  20: "33",
  19: "30",
  18: "2E",
  17: "2B",
  16: "29",
  15: "26",
  14: "24",
  13: "21",
  12: "1F",
  11: "1C",
  10: "1A",
  9: "17",
  8: "14",
  7: "12",
  6: "0F",
  5: "0D",
  4: "0A",
  3: "08",
  2: "05",
  1: "03",
  0: "00"
};

function parseHSVAColor(hsva) {
  const saturation = hsva.s / 100;
  const value = hsva.v / 100;
  let chroma = saturation * value;
  let hueBy60 = hsva.h / 60;
  let x = chroma * (1 - Math.abs(hueBy60 % 2 - 1));
  let m = value - chroma;
  chroma = chroma + m;
  x = x + m;
  const index = Math.floor(hueBy60) % 6;
  const red = [chroma, x, m, m, x, chroma][index];
  const green = [x, chroma, chroma, x, m, m][index];
  const blue = [m, m, x, chroma, chroma, x][index];
  return {
    rgba: `rgba(${Math.round(red * 255)}, ${Math.round(green * 255)}, ${Math.round(blue * 255)}, ${hsva.a < 1 && hsva.a > 0 ? hsva.a.toFixed(2) : hsva.a})`,
    hex: ("#" + Math.round(red * 255).toString(16).padStart(2, "0") + Math.round(green * 255).toString(16).padStart(2, "0") + Math.round(blue * 255).toString(16).padStart(2, "0") + hexTransperancies[Math.round(hsva.a * 100)]).toUpperCase()
  };
}
function RGBAToHSVA(rgba) {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) {
    throw new Error("Invalid RGBA color format");
  }
  const r = parseInt(match[1], 10) / 255;
  const g = parseInt(match[2], 10) / 255;
  const b = parseInt(match[3], 10) / 255;
  const a = match[4] ? parseFloat(match[4]) : 1;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
    } else if (max === g) {
      h = ((b - r) / delta + 2) * 60;
    } else {
      h = ((r - g) / delta + 4) * 60;
    }
  }
  const s = max === 0 ? 0 : delta / max * 100;
  const v = max * 100;
  return {
    h: Math.round(h),
    s: Math.round(s),
    v: Math.round(v),
    a: parseFloat(a.toFixed(2))
  };
}
function RGBAOrHEXToHSVA(color) {
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
      return RGBAToHSVA(`rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`);
    }
  }
  if (color.startsWith("rgba") || color.startsWith("rgb")) {
    return RGBAToHSVA(color);
  }
  throw new Error("Invalid color format. Please provide a valid HEX or RGBA color.");
}

const segment = "_segment_c0wyc_12";
const XYSlider = "_XYSlider_c0wyc_63";
const styles = {
	"color-picker": "_color-picker_c0wyc_1",
	"size-s": "_size-s_c0wyc_8",
	"segment-button": "_segment-button_c0wyc_12",
	"color-preview-text": "_color-preview-text_c0wyc_13",
	segment: segment,
	"color-preview-wrapper": "_color-preview-wrapper_c0wyc_19",
	"size-m": "_size-m_c0wyc_25",
	"size-l": "_size-l_c0wyc_36",
	"size-xl": "_size-xl_c0wyc_44",
	"slider-handle": "_slider-handle_c0wyc_53",
	"slider-fill": "_slider-fill_c0wyc_59",
	XYSlider: XYSlider,
	"XYSlider-handle": "_XYSlider-handle_c0wyc_69",
	"hue-slider": "_hue-slider_c0wyc_77",
	"alpha-slider": "_alpha-slider_c0wyc_78",
	"hue-slider-track": "_hue-slider-track_c0wyc_92",
	"alpha-slider-track": "_alpha-slider-track_c0wyc_103",
	"color-preview": "_color-preview_c0wyc_13",
	"color-preview-box": "_color-preview-box_c0wyc_135"
};

var _tmpl$ = /* @__PURE__ */ template(`<div><!$><!/><!$><!/><!$><!/><!$><!/><div><div><div></div></div><!$><!/>`);
const ColorPicker = (props) => {
  let element;
  let xySliderRef;
  let hueSliderRef;
  let alphaSliderRef;
  let changingColorFromRef = false;
  const initialValue = RGBAOrHEXToHSVA(props.value ?? "rgba(255, 0, 0, 1)");
  const [color, setColor] = createSignal(initialValue);
  const [selectedFormat, setSelectedFormat] = createSignal("hex");
  const updateColor = (updates) => {
    setColor((prev) => {
      const newColor = {
        ...prev,
        ...updates
      };
      props.onChange?.(newColor);
      return newColor;
    });
  };
  const handleXYChange = ({
    x,
    y
  }) => {
    if (changingColorFromRef) return;
    updateColor({
      s: parseFloat(x.toFixed(2)),
      v: parseFloat((100 - y).toFixed(2))
    });
  };
  const handleHueChange = (hue) => {
    if (changingColorFromRef) return;
    updateColor({
      h: hue
    });
  };
  const handleAlphaChange = (alpha) => {
    if (changingColorFromRef) return;
    updateColor({
      a: alpha * 0.01
    });
  };
  const createRGBA = (updates = {}) => parseHSVAColor({
    ...color(),
    ...updates
  }).rgba;
  const selectedColorHue = createMemo(() => createRGBA({
    s: 100,
    v: 100,
    a: 1
  }));
  const selectedColor = createMemo(() => createRGBA());
  const selectedColorNonTransparent = createMemo(() => createRGBA({
    a: 1
  }));
  const XYSliderBackground = createMemo(() => {
    const rgba = createRGBA({
      s: 100,
      v: 100,
      a: 1
    });
    return {
      "background-image": `linear-gradient(rgba(0,0,0,0),#000),linear-gradient(90deg,#fff, ${rgba})`
    };
  });
  const colorTextValue = createMemo(() => {
    const {
      rgba,
      hex
    } = parseHSVAColor(color());
    return selectedFormat() === "hex" ? hex : rgba;
  });
  const colorPickerClasses = createMemo(() => {
    const classes = [styles["color-picker"]];
    const sizeClass = styles[`size-${(props.size ?? "L").toLowerCase()}`];
    if (sizeClass) classes.push(sizeClass);
    return classes.join(" ");
  });
  const changeColor = (newColor) => {
    const parsedColor = RGBAOrHEXToHSVA(newColor);
    changingColorFromRef = true;
    xySliderRef.changeValue({
      x: parsedColor.s,
      y: 100 - parsedColor.v
    });
    hueSliderRef.changeValue(parsedColor.h);
    alphaSliderRef.changeValue(parsedColor.a * 100);
    updateColor(parsedColor);
    changingColorFromRef = false;
  };
  props.componentClasses = () => colorPickerClasses();
  onMount(() => {
    if (!props.ref || !element) return;
    props.ref({
      value: () => parseHSVAColor(color()),
      changeColor,
      element
    });
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$), _el$7 = _el$.firstChild, [_el$8, _co$2] = getNextMarker(_el$7.nextSibling), _el$9 = _el$8.nextSibling, [_el$0, _co$3] = getNextMarker(_el$9.nextSibling), _el$1 = _el$0.nextSibling, [_el$10, _co$4] = getNextMarker(_el$1.nextSibling), _el$11 = _el$10.nextSibling, [_el$12, _co$5] = getNextMarker(_el$11.nextSibling), _el$2 = _el$12.nextSibling, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$3.nextSibling, [_el$6, _co$] = getNextMarker(_el$5.nextSibling);
    use(navigationActions, _el$, () => ({
      anchor: props.anchor,
      ...props.onAction
    }));
    use(baseComponent, _el$, () => props);
    var _ref$ = element;
    typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
    insert(_el$, createComponent(XYSlider$1, {
      ref(r$) {
        var _ref$2 = xySliderRef;
        typeof _ref$2 === "function" ? _ref$2(r$) : xySliderRef = r$;
      },
      get value() {
        return {
          x: initialValue.s,
          y: 100 - initialValue.v
        };
      },
      get ["class"]() {
        return styles.XYSlider;
      },
      onChange: handleXYChange,
      get children() {
        return [createComponent(XYSlider$1.Background, {
          get style() {
            return XYSliderBackground();
          }
        }), createComponent(XYSlider$1.Handle, {
          get ["class"]() {
            return styles["XYSlider-handle"];
          },
          get style() {
            return {
              "background-color": selectedColorNonTransparent()
            };
          }
        })];
      }
    }), _el$8, _co$2);
    insert(_el$, createComponent(Slider, {
      ref(r$) {
        var _ref$3 = hueSliderRef;
        typeof _ref$3 === "function" ? _ref$3(r$) : hueSliderRef = r$;
      },
      min: 0,
      max: 360,
      get value() {
        return initialValue.h;
      },
      onChange: handleHueChange,
      get ["class"]() {
        return styles["hue-slider"];
      },
      get children() {
        return [createComponent(Slider.Track, {
          get ["class"]() {
            return styles["hue-slider-track"];
          }
        }), createComponent(Slider.Fill, {
          get ["class"]() {
            return styles["slider-fill"];
          }
        }), createComponent(Slider.Handle, {
          get ["class"]() {
            return styles["slider-handle"];
          },
          get style() {
            return {
              background: selectedColorHue()
            };
          }
        })];
      }
    }), _el$0, _co$3);
    insert(_el$, createComponent(Slider, {
      ref(r$) {
        var _ref$4 = alphaSliderRef;
        typeof _ref$4 === "function" ? _ref$4(r$) : alphaSliderRef = r$;
      },
      get value() {
        return initialValue.a * 100;
      },
      onChange: handleAlphaChange,
      get ["class"]() {
        return styles["alpha-slider"];
      },
      get children() {
        return [createComponent(Slider.Track, {
          get ["class"]() {
            return styles["alpha-slider-track"];
          },
          get style() {
            return {
              "background-image": `linear-gradient(to right,transparent 0% , ${selectedColorNonTransparent()} 100% )`
            };
          }
        }), createComponent(Slider.Fill, {
          get ["class"]() {
            return styles["slider-fill"];
          }
        }), createComponent(Slider.Handle, {
          get ["class"]() {
            return styles["slider-handle"];
          },
          get style() {
            return {
              background: selectedColor()
            };
          }
        })];
      }
    }), _el$10, _co$4);
    insert(_el$, createComponent(Segment, {
      get ["class"]() {
        return styles.segment;
      },
      onChange: (value) => setSelectedFormat(value),
      get children() {
        return [createComponent(Segment.Indicator, {
          get ["class"]() {
            return styles["segment-indicator"];
          }
        }), createComponent(Segment.Button, {
          get ["class"]() {
            return styles["segment-button"];
          },
          selected: true,
          value: "hex",
          children: "HEX"
        }), createComponent(Segment.Button, {
          get ["class"]() {
            return styles["segment-button"];
          },
          value: "rgba",
          children: "RGBA"
        })];
      }
    }), _el$12, _co$5);
    insert(_el$2, createComponent(TextInput, {
      get ["class"]() {
        return styles["color-preview-text"];
      },
      readonly: true,
      get value() {
        return colorTextValue();
      }
    }), _el$6, _co$);
    createRenderEffect((_p$) => {
      var _v$ = styles["color-preview-wrapper"], _v$2 = styles["color-preview"], _v$3 = styles["color-preview-box"], _v$4 = selectedColor();
      _v$ !== _p$.e && className(_el$2, _p$.e = _v$);
      _v$2 !== _p$.t && className(_el$3, _p$.t = _v$2);
      _v$3 !== _p$.a && className(_el$4, _p$.a = _v$3);
      _v$4 !== _p$.o && setStyleProperty(_el$4, "background-color", _p$.o = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$;
  })();
};

const jigi11 = (root) => render(() => createComponent(ColorPicker, {}), root);

export { jigi11 as default };
