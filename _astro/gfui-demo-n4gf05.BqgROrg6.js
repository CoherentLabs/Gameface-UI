import { A as delegateEvents, g as getNextElement, v as getNextMarker, i as insert, c as createComponent, y as memo, F as For, n as createRenderEffect, p as className, B as runHydrationEvents, w as Show, t as template, r as render, a as createSignal } from './web.DoGxwvvO.js';
import { D as Dropdown } from './Dropdown.C9IHZSoC.js';
import { F as Flex } from './Flex.C48KVvZ2.js';
import './tokenComponents.C6MElWh1.js';
import './BaseComponent.DmBIQgSj.js';
import './store.BChLrIuc.js';
import './InlineTextBlock.DoiA0RIT.js';
import './getScrollableParent.C3YActer.js';
import './mergeNavigationActions.C3r_vRJZ.js';
import './Scroll.WFzKwYjT.js';
import './LayoutBase.V5Pt4GTE.js';
import './clamp.BBPiOs3-.js';
import './supportsGamefaceFeature.ByqsM1VI.js';

const countries = [
  { name: "Argentina", code: "ar" },
  { name: "Brazil", code: "br" },
  { name: "Canada", code: "ca" },
  { name: "Ivory Coast", code: "ci" },
  { name: "Chile", code: "cl" },
  { name: "Germany", code: "de" },
  { name: "Denmark", code: "dk" },
  { name: "Egypt", code: "eg" },
  { name: "England", code: "eng" },
  { name: "France", code: "fr" },
  { name: "Ireland", code: "ie" },
  { name: "Italy", code: "it" },
  { name: "Jordan", code: "jo" },
  { name: "Japan", code: "jp" },
  { name: "South Korea", code: "kr" },
  { name: "Mexico", code: "mx" },
  { name: "Nigeria", code: "ng" },
  { name: "Portugal", code: "pt" },
  { name: "Serbia", code: "rs" },
  { name: "Sweden", code: "se" },
  { name: "United States", code: "us" },
  { name: "Vietnam", code: "vn" },
  { name: "Spain", code: "es" }
];

const wrapper = "_wrapper_11935_1";
const chips = "_chips_11935_7";
const chip = "_chip_11935_7";
const dropdown = "_dropdown_11935_49";
const styles = {
	wrapper: wrapper,
	chips: chips,
	chip: chip,
	"chip-image": "_chip-image_11935_25",
	"chip-remove": "_chip-remove_11935_31",
	dropdown: dropdown,
	"dropdown-trigger": "_dropdown-trigger_11935_52",
	"dropdown-placeholder": "_dropdown-placeholder_11935_64",
	"dropdown-options": "_dropdown-options_11935_67",
	"dropdown-scrollbar": "_dropdown-scrollbar_11935_75",
	"dropdown-handle": "_dropdown-handle_11935_78",
	"dropdown-option": "_dropdown-option_11935_67",
	"dropdown-option-content": "_dropdown-option-content_11935_88",
	"dropdown-option-content-image": "_dropdown-option-content-image_11935_94",
	"dropdown-option-selected": "_dropdown-option-selected_11935_105",
	"dropdown-icon": "_dropdown-icon_11935_109"
};

var _tmpl$$1 = /* @__PURE__ */ template(`<div>`), _tmpl$2 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`), _tmpl$3 = /* @__PURE__ */ template(`<div><div></div><!$><!/>`), _tmpl$4 = /* @__PURE__ */ template(`<div style=position:absolute>`), _tmpl$5 = /* @__PURE__ */ template(`<div><!$><!/><div>x`);
const ChipMultiSelect = (props) => {
  let dropdownRef;
  return (() => {
    var _el$ = getNextElement(_tmpl$2), _el$3 = _el$.firstChild, [_el$4, _co$] = getNextMarker(_el$3.nextSibling), _el$5 = _el$4.nextSibling, [_el$6, _co$2] = getNextMarker(_el$5.nextSibling);
    insert(_el$, createComponent(Dropdown, {
      ref(r$) {
        var _ref$ = dropdownRef;
        typeof _ref$ === "function" ? _ref$(r$) : dropdownRef = r$;
      },
      get value() {
        return props.value;
      },
      multiple: true,
      get ["class"]() {
        return styles.dropdown;
      },
      onChange: (values) => props.onChange(values),
      get children() {
        return [createComponent(Dropdown.Placeholder, {
          get ["class"]() {
            return styles["dropdown-placeholder"];
          },
          get children() {
            return memo(() => !!props.value.length)() ? `${props.value.length} selected` : "Any";
          }
        }), createComponent(Dropdown.Trigger, {
          get ["class"]() {
            return styles["dropdown-trigger"];
          }
        }), createComponent(Dropdown.Icon, {
          get ["class"]() {
            return styles["dropdown-icon"];
          }
        }), createComponent(Dropdown.Track, {
          get ["class"]() {
            return styles["dropdown-scrollbar"];
          }
        }), createComponent(Dropdown.Handle, {
          get ["class"]() {
            return styles["dropdown-handle"];
          }
        }), createComponent(Dropdown.Options, {
          get ["class"]() {
            return styles["dropdown-options"];
          },
          get children() {
            return createComponent(For, {
              each: countries,
              children: (country) => createComponent(Dropdown.Option, {
                get ["class"]() {
                  return styles["dropdown-option"];
                },
                get ["class-selected"]() {
                  return styles["dropdown-option-selected"];
                },
                get value() {
                  return country.code;
                },
                get children() {
                  var _el$7 = getNextElement(_tmpl$3), _el$8 = _el$7.firstChild, _el$9 = _el$8.nextSibling, [_el$0, _co$3] = getNextMarker(_el$9.nextSibling);
                  insert(_el$8, () => country.name);
                  insert(_el$7, createComponent(Flex, {
                    "justify-content": "center",
                    "align-items": "center",
                    get ["class"]() {
                      return styles["dropdown-option-content-image"];
                    },
                    style: {
                      "background-color": "gray",
                      "color": "white",
                      "text-align": "center"
                    },
                    get children() {
                      return country.code;
                    }
                  }), _el$0, _co$3);
                  createRenderEffect(() => className(_el$7, styles["dropdown-option-content"]));
                  return _el$7;
                }
              })
            });
          }
        })];
      }
    }), _el$4, _co$);
    insert(_el$, createComponent(Show, {
      get when() {
        return props.value.length;
      },
      get fallback() {
        return getNextElement(_tmpl$4);
      },
      get children() {
        var _el$2 = getNextElement(_tmpl$$1);
        insert(_el$2, createComponent(For, {
          get each() {
            return props.value;
          },
          children: (value) => (() => {
            var _el$10 = getNextElement(_tmpl$5), _el$12 = _el$10.firstChild, [_el$13, _co$4] = getNextMarker(_el$12.nextSibling), _el$11 = _el$13.nextSibling;
            insert(_el$10, createComponent(Flex, {
              "justify-content": "center",
              "align-items": "center",
              get ["class"]() {
                return styles["chip-image"];
              },
              style: {
                "background-color": "gray",
                "color": "white",
                "text-align": "center"
              },
              children: value
            }), _el$13, _co$4);
            _el$11.$$click = () => dropdownRef.deselectOption(value);
            createRenderEffect((_p$) => {
              var _v$ = styles.chip, _v$2 = styles["chip-remove"];
              _v$ !== _p$.e && className(_el$10, _p$.e = _v$);
              _v$2 !== _p$.t && className(_el$11, _p$.t = _v$2);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            runHydrationEvents();
            return _el$10;
          })()
        }));
        createRenderEffect(() => className(_el$2, styles.chips));
        return _el$2;
      }
    }), _el$6, _co$2);
    createRenderEffect(() => className(_el$, styles.wrapper));
    return _el$;
  })();
};
delegateEvents(["click"]);

var _tmpl$ = /* @__PURE__ */ template(`<div style=width:15rem>`);
const App = () => {
  const [selectedCountries, setSelectedCountries] = createSignal(["br", "jp"]);
  return (() => {
    var _el$ = getNextElement(_tmpl$);
    insert(_el$, createComponent(ChipMultiSelect, {
      get value() {
        return selectedCountries();
      },
      onChange: setSelectedCountries
    }));
    return _el$;
  })();
};
const n4gf05 = (root) => render(() => createComponent(App, {}), root);

export { n4gf05 as default };
