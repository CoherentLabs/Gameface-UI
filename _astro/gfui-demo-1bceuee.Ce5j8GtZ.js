import { N as createRoot, b as createMemo, A as delegateEvents, g as getNextElement, i as insert, n as createRenderEffect, p as className, B as runHydrationEvents, t as template, c as createComponent, a as createSignal, o as onMount, F as For, v as getNextMarker, y as memo, w as Show, s as style, j as createEffect, k as on, l as onCleanup, u as use, z as addEventListener, O as Index, r as render } from './web.DoGxwvvO.js';
import { F as Flex } from './Flex.C48KVvZ2.js';
import { c as Column, R as Row } from './Column.DVv7-BsA.js';
import { c as createStore, p as produce } from './store.BChLrIuc.js';
import { R as Relative } from './Relative.BUr6YPMP.js';
import { A as Absolute } from './Absolute.BPxQK_Ps.js';
import { P as Progress } from './Progress.CdrW4xvp.js';
import { I as InlineTextBlock } from './InlineTextBlock.DoiA0RIT.js';
import { B as BackgroundImage } from './BackgroundImage.CyYNtSoL.js';
import { T as ToggleButton } from './ToggleButton.Cyn5Y5x0.js';
import { D as Dropdown$1 } from './Dropdown.C9IHZSoC.js';
import { S as Slider$1, G as Grid, a as SliderGrid } from './Slider.BQSjB7Dh.js';
import { s as styles$7, T as Track, a as Thumb, H as Handle, b as snapToStepAndNormalize, S as SliderHandle, d as SliderThumb, e as SliderTrack, g as getTrackGeometry, f as stopImmediatePropagation, h as calculatePercent } from './stopPropagation.CjO2FxVc.js';
import { c as clamp } from './clamp.BBPiOs3-.js';
import { c as createTokenComponent, u as useToken } from './tokenComponents.C6MElWh1.js';
import { n as navigationActions, b as baseComponent } from './BaseComponent.DmBIQgSj.js';
import { m as mergeNavigationActions } from './mergeNavigationActions.C3r_vRJZ.js';
import { P as Pagination$1 } from './Pagination.TeX9nq1d.js';
import { T as TextInput } from './TextInput.9mqNCZAO.js';
import './LayoutBase.V5Pt4GTE.js';
import './supportsGamefaceFeature.ByqsM1VI.js';
import './getScrollableParent.C3YActer.js';
import './Scroll.WFzKwYjT.js';
import './TextInput.module.BwSsDWcg.js';
import './AddonSlot.BXBtX8DB.js';

const POSITIONS = ["fwd", "mid", "def", "gk"];

const table = "_table_1r5ky_1";
const nav = "_nav_1r5ky_13";
const filter = "_filter_1r5ky_33";
const header = "_header_1r5ky_130";
const body = "_body_1r5ky_137";
const footer = "_footer_1r5ky_145";
const row = "_row_1r5ky_162";
const column = "_column_1r5ky_181";
const styles$6 = {
	table: table,
	nav: nav,
	"nav-heading": "_nav-heading_1r5ky_19",
	"nav-heading-highlight": "_nav-heading-highlight_1r5ky_29",
	filter: filter,
	"filter-trigger": "_filter-trigger_1r5ky_39",
	"filter-trigger-icon": "_filter-trigger-icon_1r5ky_53",
	"filter-panel": "_filter-panel_1r5ky_57",
	"filter-panel-open": "_filter-panel-open_1r5ky_77",
	"filter-row": "_filter-row_1r5ky_81",
	"filter-row-heading": "_filter-row-heading_1r5ky_86",
	"panel-btn": "_panel-btn_1r5ky_92",
	"panel-btn-disabled": "_panel-btn-disabled_1r5ky_111",
	"panel-btn-danger": "_panel-btn-danger_1r5ky_117",
	header: header,
	body: body,
	footer: footer,
	"footer-total": "_footer-total_1r5ky_153",
	"footer-total-highlight": "_footer-total-highlight_1r5ky_158",
	row: row,
	"row-active": "_row-active_1r5ky_176",
	column: column,
	"column-image": "_column-image_1r5ky_187",
	"column-name": "_column-name_1r5ky_194",
	"column-position": "_column-position_1r5ky_198",
	"column-condition": "_column-condition_1r5ky_201",
	"column-btn": "_column-btn_1r5ky_208",
	"column-btn-active": "_column-btn-active_1r5ky_225",
	"column-btn-asc": "_column-btn-asc_1r5ky_231",
	"column-pos-mark": "_column-pos-mark_1r5ky_234"
};

const players = [
  {
    name: "Alejandro Vargas",
    nationality: "ar",
    country: "Argentina",
    position: "fwd",
    age: 27,
    appearances: 35,
    is_injured: false,
    goals: 17,
    assists: 11,
    condition: 25,
    value: 76,
    image: "fr-one"
  },
  {
    name: "Lucas Almeida",
    nationality: "br",
    country: "Brazil",
    position: "fwd",
    age: 22,
    appearances: 28,
    is_injured: false,
    goals: 19,
    assists: 11,
    condition: 45,
    value: 95,
    image: "it-one"
  },
  {
    name: "Sophie Brooks",
    nationality: "ca",
    country: "Canada",
    position: "mid",
    age: 24,
    appearances: 29,
    is_injured: false,
    goals: 5,
    assists: 12,
    condition: 67,
    value: 44,
    image: "ca-one"
  },
  {
    name: "Oumar Koné",
    nationality: "ci",
    country: "Ivory Coast",
    position: "def",
    age: 29,
    appearances: 38,
    is_injured: false,
    goals: 1,
    assists: 5,
    condition: 88,
    value: 41,
    image: "ci-one"
  },
  {
    name: "Camila Rojas",
    nationality: "cl",
    country: "Chile",
    position: "mid",
    age: 25,
    appearances: 22,
    is_injured: false,
    goals: 7,
    assists: 9,
    condition: 55,
    value: 33,
    image: "cl-one"
  },
  {
    name: "Maximilian Brandt",
    nationality: "de",
    country: "Germany",
    position: "def",
    age: 26,
    appearances: 36,
    is_injured: false,
    goals: 3,
    assists: 6,
    condition: 90,
    value: 68,
    image: "de-one"
  },
  {
    name: "Mette Andersen",
    nationality: "dk",
    country: "Denmark",
    position: "gk",
    age: 30,
    appearances: 34,
    is_injured: false,
    goals: 0,
    assists: 2,
    condition: 82,
    value: 49,
    image: "dk-one"
  },
  {
    name: "Omar Hassan",
    nationality: "eg",
    country: "Egypt",
    position: "mid",
    age: 27,
    appearances: 30,
    is_injured: false,
    goals: 8,
    assists: 10,
    condition: 73,
    value: 52,
    image: "eg-one"
  },
  {
    name: "Oliver Hayes",
    nationality: "eng",
    country: "England",
    position: "gk",
    age: 33,
    appearances: 38,
    is_injured: false,
    goals: 0,
    assists: 1,
    condition: 61,
    value: 28,
    image: "eng-one"
  },
  {
    name: "Carlos Fernández",
    nationality: "es",
    country: "Spain",
    position: "fwd",
    age: 24,
    appearances: 32,
    is_injured: false,
    goals: 23,
    assists: 9,
    condition: 93,
    value: 94,
    image: "de-two"
  },
  {
    name: "Antoine Moreau",
    nationality: "fr",
    country: "France",
    position: "mid",
    age: 28,
    appearances: 40,
    is_injured: false,
    goals: 6,
    assists: 18,
    condition: 89,
    value: 78,
    image: "fr-one"
  },
  {
    name: "Ciarán Murphy",
    nationality: "ie",
    country: "Ireland",
    position: "def",
    age: 30,
    appearances: 24,
    is_injured: true,
    goals: 1,
    assists: 4,
    condition: 38,
    value: 31,
    image: "eng-two"
  },
  {
    name: "Marco Ricci",
    nationality: "it",
    country: "Italy",
    position: "def",
    age: 27,
    appearances: 33,
    is_injured: false,
    goals: 4,
    assists: 5,
    condition: 84,
    value: 63,
    image: "it-one"
  },
  {
    name: "Khalid Al-Rashid",
    nationality: "jo",
    country: "Jordan",
    position: "mid",
    age: 21,
    appearances: 16,
    is_injured: false,
    goals: 3,
    assists: 7,
    condition: 80,
    value: 35,
    image: "ci-two"
  },
  {
    name: "Kaelen 'Cyber' Voss",
    nationality: "jp",
    country: "Japan",
    position: "fwd",
    age: 24,
    appearances: 20,
    is_injured: false,
    goals: 20,
    assists: 7,
    condition: 85,
    value: 80,
    image: "jp-one"
  },
  {
    name: "Ji-Ho Park",
    nationality: "kr",
    country: "South Korea",
    position: "mid",
    age: 26,
    appearances: 35,
    is_injured: false,
    goals: 8,
    assists: 13,
    condition: 88,
    value: 71,
    image: "kr-one"
  },
  {
    name: "Diego Herrera",
    nationality: "mx",
    country: "Mexico",
    position: "def",
    age: 32,
    appearances: 39,
    is_injured: false,
    goals: 2,
    assists: 5,
    condition: 66,
    value: 29,
    image: "vn-one"
  },
  {
    name: "Amara Okafor",
    nationality: "ng",
    country: "Nigeria",
    position: "fwd",
    age: 19,
    appearances: 12,
    is_injured: false,
    goals: 9,
    assists: 4,
    condition: 94,
    value: 62,
    image: "ng-one"
  },
  {
    name: "Rui Figueiredo",
    nationality: "pt",
    country: "Portugal",
    position: "mid",
    age: 27,
    appearances: 36,
    is_injured: false,
    goals: 10,
    assists: 16,
    condition: 87,
    value: 82,
    image: "fr-one"
  },
  {
    name: "Stefan Nikolić",
    nationality: "rs",
    country: "Serbia",
    position: "def",
    age: 34,
    appearances: 42,
    is_injured: false,
    goals: 2,
    assists: 4,
    condition: 57,
    value: 21,
    image: "de-two"
  },
  {
    name: "Erik Lindqvist",
    nationality: "se",
    country: "Sweden",
    position: "gk",
    age: 23,
    appearances: 19,
    is_injured: false,
    goals: 0,
    assists: 0,
    condition: 78,
    value: 38,
    image: "eng-two"
  },
  {
    name: "Maya Webb",
    nationality: "us",
    country: "United States",
    position: "fwd",
    age: 25,
    appearances: 27,
    is_injured: false,
    goals: 13,
    assists: 7,
    condition: 83,
    value: 69,
    image: "us-one"
  },
  {
    name: "Mai Nguyen",
    nationality: "vn",
    country: "Vietnam",
    position: "def",
    age: 26,
    appearances: 29,
    is_injured: false,
    goals: 1,
    assists: 3,
    condition: 68,
    value: 22,
    image: "vn-two"
  },
  {
    name: "Gabriel Souza",
    nationality: "br",
    country: "Brazil",
    position: "mid",
    age: 21,
    appearances: 15,
    is_injured: false,
    goals: 6,
    assists: 10,
    condition: 95,
    value: 77,
    image: "it-one"
  },
  {
    name: "Hiroshi Tanaka",
    nationality: "jp",
    country: "Japan",
    position: "mid",
    age: 29,
    appearances: 34,
    is_injured: false,
    goals: 8,
    assists: 15,
    condition: 79,
    value: 53,
    image: "jp-two"
  },
  {
    name: "Felix Wagner",
    nationality: "de",
    country: "Germany",
    position: "mid",
    age: 23,
    appearances: 19,
    is_injured: true,
    goals: 5,
    assists: 8,
    condition: 32,
    value: 55,
    image: "de-one"
  },
  {
    name: "Jack Thornton",
    nationality: "eng",
    country: "England",
    position: "mid",
    age: 25,
    appearances: 31,
    is_injured: false,
    goals: 12,
    assists: 9,
    condition: 81,
    value: 72,
    image: "eng-two"
  },
  {
    name: "Rafael Costa",
    nationality: "br",
    country: "Brazil",
    position: "def",
    age: 30,
    appearances: 41,
    is_injured: true,
    goals: 2,
    assists: 4,
    condition: 47,
    value: 34,
    image: "fr-one"
  },
  {
    name: "Jonas Keller",
    nationality: "de",
    country: "Germany",
    position: "gk",
    age: 31,
    appearances: 40,
    is_injured: false,
    goals: 0,
    assists: 0,
    condition: 86,
    value: 53,
    image: "de-two"
  },
  {
    name: "Harry Whitmore",
    nationality: "eng",
    country: "England",
    position: "fwd",
    age: 35,
    appearances: 29,
    is_injured: false,
    goals: 11,
    assists: 5,
    condition: 58,
    value: 18,
    image: "eng-one"
  },
  {
    name: "Sora Yamamoto",
    nationality: "jp",
    country: "Japan",
    position: "def",
    age: 28,
    appearances: 33,
    is_injured: false,
    goals: 1,
    assists: 3,
    condition: 84,
    value: 50,
    image: "jp-four"
  },
  {
    name: "Renata Oliveira",
    nationality: "br",
    country: "Brazil",
    position: "fwd",
    age: 18,
    appearances: 7,
    is_injured: false,
    goals: 3,
    assists: 2,
    condition: 91,
    value: 61,
    image: "br-one"
  },
  {
    name: "Pedro Cunha",
    nationality: "pt",
    country: "Portugal",
    position: "fwd",
    age: 22,
    appearances: 20,
    is_injured: false,
    goals: 11,
    assists: 5,
    condition: 82,
    value: 66,
    image: "eng-one"
  },
  {
    name: "Yoon Ji-Soo",
    nationality: "kr",
    country: "South Korea",
    position: "def",
    age: 28,
    appearances: 32,
    is_injured: false,
    goals: 2,
    assists: 3,
    condition: 86,
    value: 57,
    image: "kr-three"
  },
  {
    name: "Ivan Kovač",
    nationality: "rs",
    country: "Serbia",
    position: "fwd",
    age: 24,
    appearances: 23,
    is_injured: false,
    goals: 15,
    assists: 6,
    condition: 75,
    value: 73,
    image: "de-two"
  }
];

const [playersState, setPlayersState] = createStore(players);
const { countries, numericStats } = createRoot(() => {
  const countries2 = createMemo(() => playersState.reduce((acc, player2) => {
    if (!acc.some((c) => c.name === player2.country)) {
      acc.push({ name: player2.country, code: player2.nationality });
    }
    return acc;
  }, []));
  const numericStats2 = createMemo(
    () => playersState.reduce(
      (acc, p) => ({
        age: { min: Math.min(acc.age.min, p.age), max: Math.max(acc.age.max, p.age) },
        appearances: { min: Math.min(acc.appearances.min, p.appearances), max: Math.max(acc.appearances.max, p.appearances) },
        goals: { min: Math.min(acc.goals.min, p.goals), max: Math.max(acc.goals.max, p.goals) },
        assists: { min: Math.min(acc.assists.min, p.assists), max: Math.max(acc.assists.max, p.assists) },
        condition: { min: Math.min(acc.condition.min, p.condition), max: Math.max(acc.condition.max, p.condition) },
        value: { min: Math.min(acc.value.min, p.value), max: Math.max(acc.value.max, p.value) }
      }),
      {
        age: { min: Infinity, max: -Infinity },
        appearances: { min: Infinity, max: -Infinity },
        goals: { min: Infinity, max: -Infinity },
        assists: { min: Infinity, max: -Infinity },
        condition: { min: Infinity, max: -Infinity },
        value: { min: Infinity, max: -Infinity }
      }
    )
  );
  return { countries: countries2, numericStats: numericStats2 };
});

var _tmpl$$9 = /* @__PURE__ */ template(`<div>`);
const HeaderColumnButton = (props) => {
  const classes = createMemo(() => {
    const base = [styles$6["column-btn"]];
    if (props.category === props.currentSort()) {
      base.push(styles$6["column-btn-active"]);
      if (props.asc()) base.push(styles$6["column-btn-asc"]);
    }
    return base.join(" ");
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$9);
    _el$.$$click = () => props.clickHandler(props.category);
    insert(_el$, () => props.children);
    createRenderEffect(() => className(_el$, classes()));
    runHydrationEvents();
    return _el$;
  })();
};
delegateEvents(["click"]);

const bar = "_bar_hdsc4_1";
const success = "_success_hdsc4_26";
const warning = "_warning_hdsc4_30";
const error = "_error_hdsc4_34";
const styles$5 = {
	bar: bar,
	"bar-fill": "_bar-fill_hdsc4_9",
	success: success,
	warning: warning,
	error: error
};

const SEGMENTS = 10;
const GAP = 1.5;
const OVERSHOOT = 0.5;
const PILL_WIDTH = (100 + GAP + OVERSHOOT) / SEGMENTS;
const clampValueToSegment = (value) => {
  const pills = Math.floor(value / (100 / SEGMENTS));
  if (pills <= 0) return 0;
  if (pills >= SEGMENTS) return 100;
  return pills * PILL_WIDTH - GAP / 2;
};
const ConditionBar = (props) => {
  const progressFillClasses = createMemo(() => {
    const base = [styles$5["bar-fill"]];
    const value = props.value;
    if (value >= 50) base.push(styles$5.success);
    else if (value >= 30) base.push(styles$5.warning);
    else base.push(styles$5.error);
    return base.join(" ");
  });
  return createComponent(Progress.Bar, {
    get ["class"]() {
      return styles$5.bar;
    },
    get progress() {
      return clampValueToSegment(props.value);
    },
    get children() {
      return createComponent(Progress.Bar.Fill, {
        get ["class"]() {
          return progressFillClasses();
        }
      });
    }
  });
};

var _tmpl$$8 = /* @__PURE__ */ template(`<div>`);
const getInitials = (name) => {
  const letters = name.match(/[A-Za-z]+/g) ?? [];
  return ((letters[0]?.[0] ?? "") + (letters[letters.length - 1]?.[0] ?? "")).toUpperCase();
};
const ROSTER_COLUMNS = [{
  id: "image",
  span: 1,
  header: "none",
  cell: (p) => createComponent(Flex, {
    "justify-content": "center",
    "align-items": "center",
    style: {
      width: "100%",
      height: "100%",
      "background-color": "gray",
      color: "white"
    },
    get children() {
      return getInitials(p().name);
    }
  })
}, {
  id: "name",
  span: 2,
  label: "NAME",
  header: "sort",
  columnClass: styles$6["column-name"],
  cell: (p) => (() => {
    var _el$ = getNextElement(_tmpl$$8);
    insert(_el$, () => p().name);
    createRenderEffect(() => className(_el$, styles$6["column-name-value"]));
    return _el$;
  })()
}, {
  id: "nationality",
  span: 1,
  label: "NAT.",
  header: "static",
  cell: (p) => createComponent(Flex, {
    "justify-content": "center",
    "align-items": "center",
    get ["class"]() {
      return styles$6["column-image"];
    },
    style: {
      "background-color": "gray",
      color: "white"
    },
    get children() {
      return p().nationality;
    }
  })
}, {
  id: "position",
  span: 1,
  label: "POS.",
  header: "cycle",
  cell: (p) => (() => {
    var _el$2 = getNextElement(_tmpl$$8);
    insert(_el$2, () => p().position);
    createRenderEffect(() => className(_el$2, styles$6["column-position"]));
    return _el$2;
  })()
}, {
  id: "age",
  span: 1,
  label: "AGE",
  header: "sort",
  cell: (p) => (() => {
    var _el$3 = getNextElement(_tmpl$$8);
    insert(_el$3, () => p().age);
    return _el$3;
  })()
}, {
  id: "appearances",
  span: 1,
  label: "APPS.",
  header: "sort",
  cell: (p) => (() => {
    var _el$4 = getNextElement(_tmpl$$8);
    insert(_el$4, () => p().appearances);
    return _el$4;
  })()
}, {
  id: "goals",
  span: 1,
  label: "GOALS",
  header: "sort",
  cell: (p) => (() => {
    var _el$5 = getNextElement(_tmpl$$8);
    insert(_el$5, () => p().goals);
    return _el$5;
  })()
}, {
  id: "assists",
  span: 1,
  label: "ASSISTS",
  header: "sort",
  cell: (p) => (() => {
    var _el$6 = getNextElement(_tmpl$$8);
    insert(_el$6, () => p().assists);
    return _el$6;
  })()
}, {
  id: "condition",
  span: 2,
  label: "COND.",
  header: "sort",
  cell: (p) => createComponent(Flex, {
    get ["class"]() {
      return styles$6["column-condition"];
    },
    get children() {
      return [createComponent(ConditionBar, {
        get value() {
          return p().condition;
        }
      }), (() => {
        var _el$7 = getNextElement(_tmpl$$8);
        insert(_el$7, () => `${p().condition}%`);
        return _el$7;
      })()];
    }
  })
}, {
  id: "value",
  span: 1,
  label: "VALUE",
  header: "sort",
  cell: (p) => (() => {
    var _el$8 = getNextElement(_tmpl$$8);
    insert(_el$8, () => `€${p().value}M`);
    return _el$8;
  })()
}];

var _tmpl$$7 = /* @__PURE__ */ template(`<div>`);
const DEFAULT_SORT_KEY = "goals";
const TableHeader = () => {
  const [asc, setAsc] = createSignal(false);
  const [currentSort, setCurrentSort] = createSignal(DEFAULT_SORT_KEY);
  const positions = [...POSITIONS];
  const [currPosition, setCurrentPosition] = createSignal(void 0);
  const handleSort = (key) => {
    if (currentSort() === key) setAsc((prev) => !prev);
    sortPlayers(key);
    setCurrentSort(key);
    setCurrentPosition(void 0);
  };
  const sortPlayers = (key) => {
    setPlayersState(produce((players) => {
      players.sort((a, b) => {
        const aValue = a[key] ?? 0;
        const bValue = b[key] ?? 0;
        if (key !== "name" && key !== "nationality") {
          return asc() ? aValue - bValue : bValue - aValue;
        } else {
          return asc() ? String(aValue).localeCompare(String(bValue)) : String(bValue).localeCompare(String(aValue));
        }
      });
    }));
  };
  const cyclePosition = () => {
    if (currPosition()) {
      const lastLeadPosition = positions.shift();
      positions.push(lastLeadPosition);
    }
    setCurrentPosition(positions[0]);
    setPlayersState(produce((players) => {
      players.sort((a, b) => positions.indexOf(a.position) - positions.indexOf(b.position));
    }));
    setCurrentSort("position");
  };
  const posMark = createMemo(() => {
    const p = currPosition();
    return p ? `(${p.charAt(0)})` : null;
  });
  const renderHeaderCell = (col) => {
    switch (col.header) {
      case "sort":
        return createComponent(HeaderColumnButton, {
          asc,
          get category() {
            return col.id;
          },
          currentSort,
          clickHandler: handleSort,
          get children() {
            return col.label;
          }
        });
      case "cycle":
        return createComponent(Relative, {
          click: cyclePosition,
          get style() {
            return {
              cursor: "pointer",
              "font-weight": currentSort() === "position" ? "bold" : "normal"
            };
          },
          get children() {
            return [(() => {
              var _el$ = getNextElement(_tmpl$$7);
              insert(_el$, () => col.label);
              return _el$;
            })(), createComponent(Absolute, {
              get ["class"]() {
                return styles$6["column-pos-mark"];
              },
              get children() {
                return posMark();
              }
            })];
          }
        });
      case "static":
        return (() => {
          var _el$2 = getNextElement(_tmpl$$7);
          insert(_el$2, () => col.label);
          return _el$2;
        })();
      default:
        return null;
    }
  };
  onMount(() => sortPlayers(DEFAULT_SORT_KEY));
  return createComponent(Row, {
    get ["class"]() {
      return styles$6.header;
    },
    get children() {
      return createComponent(For, {
        each: ROSTER_COLUMNS,
        children: (col) => {
          const Col = col.span === 2 ? Column.Two : Column.One;
          return createComponent(Col, {
            get ["class"]() {
              return `${styles$6.column} ${col.columnClass ?? ""}`.trim();
            },
            get children() {
              return renderHeaderCell(col);
            }
          });
        }
      });
    }
  });
};

const TableRow = (props) => {
  return createComponent(Row, {
    get ["class"]() {
      return `${styles$6.row} ${props.index === 0 ? styles$6["row-active"] : ""}`;
    },
    get children() {
      return createComponent(For, {
        each: ROSTER_COLUMNS,
        children: (col) => {
          const Col = col.span === 2 ? Column.Two : Column.One;
          return createComponent(Col, {
            get ["class"]() {
              return `${styles$6.column} ${col.columnClass ?? ""}`.trim();
            },
            get children() {
              return col.cell(props.data);
            }
          });
        }
      });
    }
  });
};

const filterIcon = "/_astro/filter.CzazaJ9G.svg";

const toggle = "_toggle_12in5_1";
const styles$4 = {
	toggle: toggle,
	"toggle-control": "_toggle-control_12in5_7",
	"toggle-indicator": "_toggle-indicator_12in5_19",
	"toggle-handle": "_toggle-handle_12in5_22"
};

const Toggle = (props) => {
  return createComponent(ToggleButton, {
    get ["class"]() {
      return styles$4.toggle;
    },
    get ["class-checked"]() {
      return styles$4["toggle-checked"];
    },
    get checked() {
      return props.checked;
    },
    get onChange() {
      return props.onChange;
    },
    get children() {
      return [createComponent(ToggleButton.LabelLeft, {
        get ["class"]() {
          return styles$4["toggle-label-left"];
        },
        get children() {
          return props.label;
        }
      }), createComponent(ToggleButton.Control, {
        get ["class"]() {
          return styles$4["toggle-control"];
        },
        get children() {
          return [createComponent(ToggleButton.Handle, {
            get ["class"]() {
              return styles$4["toggle-handle"];
            }
          }), createComponent(ToggleButton.Indicator, {
            get ["class"]() {
              return styles$4["toggle-indicator"];
            }
          })];
        }
      })];
    }
  });
};

const wrapper = "_wrapper_11935_1";
const chips = "_chips_11935_7";
const chip = "_chip_11935_7";
const dropdown = "_dropdown_11935_49";
const styles$3 = {
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

var _tmpl$$6 = /* @__PURE__ */ template(`<div>`), _tmpl$2$4 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`), _tmpl$3$3 = /* @__PURE__ */ template(`<div><div></div><!$><!/>`), _tmpl$4$2 = /* @__PURE__ */ template(`<div style=position:absolute>`), _tmpl$5$1 = /* @__PURE__ */ template(`<div><!$><!/><div>x`);
const Dropdown = (props) => {
  let dropdownRef;
  return (() => {
    var _el$ = getNextElement(_tmpl$2$4), _el$3 = _el$.firstChild, [_el$4, _co$] = getNextMarker(_el$3.nextSibling), _el$5 = _el$4.nextSibling, [_el$6, _co$2] = getNextMarker(_el$5.nextSibling);
    insert(_el$, createComponent(Dropdown$1, {
      ref(r$) {
        var _ref$ = dropdownRef;
        typeof _ref$ === "function" ? _ref$(r$) : dropdownRef = r$;
      },
      get value() {
        return props.value;
      },
      multiple: true,
      get ["class"]() {
        return styles$3.dropdown;
      },
      onChange: (values) => props.onChange(values),
      get children() {
        return [createComponent(Dropdown$1.Placeholder, {
          get ["class"]() {
            return styles$3["dropdown-placeholder"];
          },
          get children() {
            return memo(() => !!props.value.length)() ? `${props.value.length} selected` : "Any";
          }
        }), createComponent(Dropdown$1.Trigger, {
          get ["class"]() {
            return styles$3["dropdown-trigger"];
          }
        }), createComponent(Dropdown$1.Icon, {
          get ["class"]() {
            return styles$3["dropdown-icon"];
          }
        }), createComponent(Dropdown$1.Track, {
          get ["class"]() {
            return styles$3["dropdown-scrollbar"];
          }
        }), createComponent(Dropdown$1.Handle, {
          get ["class"]() {
            return styles$3["dropdown-handle"];
          }
        }), createComponent(Dropdown$1.Options, {
          get ["class"]() {
            return styles$3["dropdown-options"];
          },
          get children() {
            return createComponent(For, {
              get each() {
                return countries();
              },
              children: (country) => createComponent(Dropdown$1.Option, {
                get ["class"]() {
                  return styles$3["dropdown-option"];
                },
                get ["class-selected"]() {
                  return styles$3["dropdown-option-selected"];
                },
                get value() {
                  return country.code;
                },
                get children() {
                  var _el$7 = getNextElement(_tmpl$3$3), _el$8 = _el$7.firstChild, _el$9 = _el$8.nextSibling, [_el$0, _co$3] = getNextMarker(_el$9.nextSibling);
                  insert(_el$8, () => country.name);
                  insert(_el$7, createComponent(Flex, {
                    "justify-content": "center",
                    "align-items": "center",
                    get ["class"]() {
                      return styles$3["dropdown-option-content-image"];
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
                  createRenderEffect(() => className(_el$7, styles$3["dropdown-option-content"]));
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
        return getNextElement(_tmpl$4$2);
      },
      get children() {
        var _el$2 = getNextElement(_tmpl$$6);
        insert(_el$2, createComponent(For, {
          get each() {
            return props.value;
          },
          children: (value) => (() => {
            var _el$10 = getNextElement(_tmpl$5$1), _el$12 = _el$10.firstChild, [_el$13, _co$4] = getNextMarker(_el$12.nextSibling), _el$11 = _el$13.nextSibling;
            insert(_el$10, createComponent(Flex, {
              "justify-content": "center",
              "align-items": "center",
              get ["class"]() {
                return styles$3["chip-image"];
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
              var _v$ = styles$3.chip, _v$2 = styles$3["chip-remove"];
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
        createRenderEffect(() => className(_el$2, styles$3.chips));
        return _el$2;
      }
    }), _el$6, _co$2);
    createRenderEffect(() => className(_el$, styles$3.wrapper));
    return _el$;
  })();
};
delegateEvents(["click"]);

const slider = "_slider_2rxal_1";
const styles$2 = {
	slider: slider,
	"slider-value": "_slider-value_2rxal_7",
	"slider-row": "_slider-row_2rxal_12",
	"slider-bound": "_slider-bound_2rxal_15",
	"slider-track": "_slider-track_2rxal_19",
	"slider-fill": "_slider-fill_2rxal_22",
	"slider-handle": "_slider-handle_2rxal_25"
};

var _tmpl$$5 = /* @__PURE__ */ template(`<div>`), _tmpl$2$3 = /* @__PURE__ */ template(`<span>`);
const Slider = (props) => {
  let sliderRef;
  return [createComponent(Flex, {
    direction: "row",
    "justify-content": "start",
    gap: "0.5rem",
    "align-items": "center",
    get children() {
      return [(() => {
        var _el$ = getNextElement(_tmpl$$5);
        insert(_el$, () => props.label);
        createRenderEffect(() => className(_el$, styles$6["filter-row-heading"]));
        return _el$;
      })(), (() => {
        var _el$2 = getNextElement(_tmpl$$5);
        insert(_el$2, () => props.value);
        createRenderEffect(() => className(_el$2, styles$2["slider-value"]));
        return _el$2;
      })()];
    }
  }), createComponent(Flex, {
    direction: "row",
    "align-items": "center",
    gap: "0.5rem",
    get ["class"]() {
      return styles$2["slider-row"];
    },
    get children() {
      return [(() => {
        var _el$3 = getNextElement(_tmpl$2$3);
        insert(_el$3, () => props.min);
        createRenderEffect(() => className(_el$3, styles$2["slider-bound"]));
        return _el$3;
      })(), createComponent(Slider$1, {
        ref(r$) {
          var _ref$ = sliderRef;
          typeof _ref$ === "function" ? _ref$(r$) : sliderRef = r$;
        },
        get ["class"]() {
          return styles$2.slider;
        },
        get min() {
          return props.min;
        },
        get max() {
          return props.max;
        },
        get value() {
          return props.value;
        },
        step: 1,
        get onChange() {
          return props.onChange;
        },
        get children() {
          return [createComponent(Slider$1.Track, {
            get ["class"]() {
              return styles$2["slider-track"];
            }
          }), createComponent(Slider$1.Fill, {
            get ["class"]() {
              return styles$2["slider-fill"];
            }
          }), createComponent(Slider$1.Handle, {
            get ["class"]() {
              return styles$2["slider-handle"];
            }
          })];
        }
      }), (() => {
        var _el$4 = getNextElement(_tmpl$2$3);
        insert(_el$4, () => props.max);
        createRenderEffect(() => className(_el$4, styles$2["slider-bound"]));
        return _el$4;
      })()];
    }
  })];
};

const DEFAULT_FILTERS = {
  position: [],
  nationality: [],
  age: void 0,
  condition: void 0,
  appearances: void 0,
  goals: void 0,
  assists: void 0
};
const isDefaultFilters = (f) => f.position.length === DEFAULT_FILTERS.position.length && f.nationality.length === DEFAULT_FILTERS.nationality.length && f.age === DEFAULT_FILTERS.age && f.condition === DEFAULT_FILTERS.condition && f.appearances === DEFAULT_FILTERS.appearances && f.goals === DEFAULT_FILTERS.goals && f.assists === DEFAULT_FILTERS.assists;

var _tmpl$$4 = /* @__PURE__ */ template(`<div>`);
const Fill = createTokenComponent();
const SliderFill = (props) => {
  const FillToken = useToken(Fill, props.parentChildren);
  const fillClasses = createMemo(() => {
    const classes = [`${styles$7.fill} ${styles$7["fill-two-handle"]}`];
    if (FillToken?.()?.class) classes.push(FillToken?.()?.class);
    return classes.join(" ");
  });
  const fillStyle = createMemo(() => {
    const offset = props.offset();
    const width = props.percent();
    const position = {
      width: `${width}%`,
      left: `${offset}%`
    };
    return {
      ...FillToken()?.style,
      ...position
    };
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$4);
    createRenderEffect((_p$) => {
      var _v$ = fillClasses(), _v$2 = fillStyle();
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _p$.t = style(_el$, _v$2, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
};

var _tmpl$$3 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const TwoHandleSlider$1 = (props) => {
  const min = () => props.min ?? 0;
  const max = () => props.max ?? 100;
  const step = () => props.step ?? 1;
  const [startValue, setStartValue] = createSignal(clamp(props.value?.start ?? min(), min(), max()));
  const [endValue, setEndValue] = createSignal(clamp(props.value?.end ?? max(), startValue() + step(), max()));
  const [activeHandle, setActiveHandle] = createSignal("start");
  const [navEngaged, setNavEngaged] = createSignal(false);
  const startPercent = () => calculatePercent(startValue(), min(), max());
  const endPercent = () => calculatePercent(endValue(), min(), max());
  const middlePercent = () => endPercent() - startPercent();
  let element;
  let trackElement;
  let sliding = false;
  let commitTimeout;
  let geometry;
  let currentStartValue, currentEndValue;
  const ThumbSlot = useToken(Thumb, props.children);
  const GridSlot = useToken(Grid, props.children);
  createEffect(on([startValue, endValue], ([start, end]) => props.onChange?.({
    start,
    end
  }), {
    defer: true
  }));
  createEffect(on(() => props.value, (newValue) => {
    if (newValue) changeValue(newValue);
  }, {
    defer: true
  }));
  const handleTrackClick = (e) => {
    geometry = getTrackGeometry(trackElement, e.clientX);
    const valueRange = max() - min();
    const delta = geometry.start - geometry.trackStart;
    const newValue = min() + delta / geometry.pixelRange * valueRange;
    const result = snapValue(newValue);
    const isStartHandle = Math.abs(newValue - startValue()) < Math.abs(newValue - endValue());
    if (isStartHandle) {
      setStartValue(clampStartValue(result));
      beginActiveDrag("start");
    } else {
      setEndValue(clampEndValue(result));
      beginActiveDrag("end");
    }
  };
  const beginActiveDrag = (handle) => {
    setActiveHandle(handle);
    if (handle === "start") currentStartValue = startValue();
    else currentEndValue = endValue();
    sliding = true;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseDownStartHandle = (e) => {
    stopImmediatePropagation(e);
    geometry = getTrackGeometry(trackElement, e.clientX);
    beginActiveDrag("start");
  };
  const handleMouseDownEndHandle = (e) => {
    stopImmediatePropagation(e);
    geometry = getTrackGeometry(trackElement, e.clientX);
    beginActiveDrag("end");
  };
  const handleMouseMove = (e) => {
    if (!sliding) return;
    const currHandle = activeHandle();
    const base = currHandle === "start" ? currentStartValue : currentEndValue;
    const result = calculateResult(e, base);
    if (currHandle === "start") {
      setStartValue(clampStartValue(result));
    } else {
      setEndValue(clampEndValue(result));
    }
  };
  const handleMouseUp = () => {
    if (!sliding) return;
    sliding = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    props.onChangeEnd?.({
      start: startValue(),
      end: endValue()
    });
  };
  const calculateResult = (e, base) => {
    const valueRange = max() - min();
    const delta = e.clientX - geometry.start;
    const deltaValue = delta / geometry.pixelRange * valueRange;
    const newValue = base + deltaValue;
    return snapValue(newValue);
  };
  const snapValue = (value) => snapToStepAndNormalize(value, step(), min(), max());
  const clampStartValue = (newValue) => {
    return Math.min(newValue, endValue() - step());
  };
  const clampEndValue = (newValue) => {
    return Math.max(newValue, startValue() + step());
  };
  const SliderClasses = createMemo(() => {
    const classes = [styles$7.slider];
    if (ThumbSlot()) classes.push(styles$7["with-thumb"]);
    if (GridSlot()) classes.push(styles$7["with-grid"]);
    return classes.join(" ");
  });
  const changeValue = (newValue) => {
    const start = Math.min(newValue.start, newValue.end - step());
    const end = Math.max(newValue.end, newValue.start + step());
    setStartValue(snapValue(start));
    setEndValue(snapValue(end));
  };
  const changeStart = (newStart) => {
    const clampedStart = clampStartValue(newStart);
    setStartValue(snapValue(clampedStart));
  };
  const changeEnd = (newEnd) => {
    const clampedEnd = clampEndValue(newEnd);
    setEndValue(snapValue(clampedEnd));
  };
  const stepStart = (direction) => {
    changeStart(startValue() + step() * direction);
  };
  const stepEnd = (direction) => {
    changeEnd(endValue() + step() * direction);
  };
  const scheduleCommit = () => {
    if (!props.onChangeEnd) return;
    if (commitTimeout) clearTimeout(commitTimeout);
    commitTimeout = setTimeout(() => {
      commitTimeout = void 0;
      props.onChangeEnd?.({
        start: startValue(),
        end: endValue()
      });
    }, 250);
  };
  const stepActive = (direction) => {
    if (activeHandle() === "start") {
      stepStart(direction);
    } else {
      stepEnd(direction);
    }
    scheduleCommit();
  };
  props.componentClasses = () => SliderClasses();
  onMount(() => {
    if (!props.ref || !element) return;
    props.ref({
      element,
      value: () => ({
        start: startValue(),
        end: endValue()
      }),
      changeValue,
      changeStart,
      changeEnd,
      stepStart,
      stepEnd
    });
  });
  onCleanup(() => {
    handleMouseUp();
    if (commitTimeout) clearTimeout(commitTimeout);
    if (sliding) {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
  });
  const defaultActions = {
    "move-left": () => {
      stepActive(-1);
    },
    "move-right": () => {
      stepActive(1);
    },
    "select": () => setActiveHandle((h) => h === "start" ? "end" : "start")
  };
  return (() => {
    var _el$ = getNextElement(_tmpl$$3), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
    use(navigationActions, _el$, () => mergeNavigationActions(props, defaultActions));
    use(baseComponent, _el$, () => props);
    addEventListener(_el$, "focusout", () => setNavEngaged(false));
    addEventListener(_el$, "focusin", () => setNavEngaged(true));
    var _ref$ = element;
    typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
    insert(_el$, createComponent(SliderTrack, {
      handleClick: handleTrackClick,
      ref(r$) {
        var _ref$2 = trackElement;
        typeof _ref$2 === "function" ? _ref$2(r$) : trackElement = r$;
      },
      get parentChildren() {
        return props.children;
      },
      get children() {
        return [createComponent(SliderHandle, {
          percent: startPercent,
          handleMouseDown: handleMouseDownStartHandle,
          get parentChildren() {
            return props.children;
          },
          active: () => activeHandle() === "start" && navEngaged(),
          dragged: () => activeHandle() === "start"
        }), createComponent(SliderThumb, {
          value: startValue,
          percent: startPercent,
          get parentChildren() {
            return props.children;
          }
        }), createComponent(SliderHandle, {
          percent: endPercent,
          handleMouseDown: handleMouseDownEndHandle,
          get parentChildren() {
            return props.children;
          },
          active: () => activeHandle() === "end" && navEngaged(),
          dragged: () => activeHandle() === "end"
        }), createComponent(SliderThumb, {
          value: endValue,
          percent: endPercent,
          get parentChildren() {
            return props.children;
          }
        }), createComponent(SliderFill, {
          percent: middlePercent,
          offset: startPercent,
          get parentChildren() {
            return props.children;
          }
        })];
      }
    }), _el$3, _co$);
    insert(_el$, createComponent(SliderGrid, {
      get min() {
        return min();
      },
      get max() {
        return max();
      },
      get parentChildren() {
        return props.children;
      }
    }), _el$5, _co$2);
    return _el$;
  })();
};
const BaseSlider = Object.assign(TwoHandleSlider$1, {
  Grid,
  Fill,
  Handle,
  Thumb,
  Track
});

var _tmpl$$2 = /* @__PURE__ */ template(`<div>`), _tmpl$2$2 = /* @__PURE__ */ template(`<div>-`), _tmpl$3$2 = /* @__PURE__ */ template(`<span>`);
const TwoHandleSlider = (props) => {
  let sliderRef;
  return [createComponent(Flex, {
    direction: "row",
    "justify-content": "start",
    gap: "0.5rem",
    "align-items": "center",
    get children() {
      return [(() => {
        var _el$ = getNextElement(_tmpl$$2);
        insert(_el$, () => props.label);
        createRenderEffect(() => className(_el$, styles$6["filter-row-heading"]));
        return _el$;
      })(), createComponent(Flex, {
        "justify-content": "start",
        "align-items": "center",
        direction: "row",
        gap: "0.25rem",
        get children() {
          return [(() => {
            var _el$2 = getNextElement(_tmpl$$2);
            insert(_el$2, () => props.value.start);
            createRenderEffect(() => className(_el$2, styles$2["slider-value"]));
            return _el$2;
          })(), getNextElement(_tmpl$2$2), (() => {
            var _el$4 = getNextElement(_tmpl$$2);
            insert(_el$4, () => props.value.end);
            createRenderEffect(() => className(_el$4, styles$2["slider-value"]));
            return _el$4;
          })()];
        }
      })];
    }
  }), createComponent(Flex, {
    direction: "row",
    "align-items": "center",
    gap: "0.5rem",
    get ["class"]() {
      return styles$2["slider-row"];
    },
    get children() {
      return [(() => {
        var _el$5 = getNextElement(_tmpl$3$2);
        insert(_el$5, () => props.min);
        createRenderEffect(() => className(_el$5, styles$2["slider-bound"]));
        return _el$5;
      })(), createComponent(BaseSlider, {
        ref(r$) {
          var _ref$ = sliderRef;
          typeof _ref$ === "function" ? _ref$(r$) : sliderRef = r$;
        },
        get ["class"]() {
          return styles$2.slider;
        },
        get min() {
          return props.min;
        },
        get max() {
          return props.max;
        },
        get value() {
          return props.value;
        },
        step: 1,
        get onChange() {
          return props.onChange;
        },
        get children() {
          return [createComponent(BaseSlider.Track, {
            get ["class"]() {
              return styles$2["slider-track"];
            }
          }), createComponent(BaseSlider.Fill, {
            get ["class"]() {
              return styles$2["slider-fill"];
            }
          }), createComponent(BaseSlider.Handle, {
            get ["class"]() {
              return styles$2["slider-handle"];
            }
          })];
        }
      }), (() => {
        var _el$6 = getNextElement(_tmpl$3$2);
        insert(_el$6, () => props.max);
        createRenderEffect(() => className(_el$6, styles$2["slider-bound"]));
        return _el$6;
      })()];
    }
  })];
};

var _tmpl$$1 = /* @__PURE__ */ template(`<div>Filter`), _tmpl$2$1 = /* @__PURE__ */ template(`<div>Position`), _tmpl$3$1 = /* @__PURE__ */ template(`<div>Apply Filters`), _tmpl$4$1 = /* @__PURE__ */ template(`<div>Reset`), _tmpl$5 = /* @__PURE__ */ template(`<div><!$><!/><div><div>Nationality</div><!$><!/></div><div></div><div></div><div></div><div></div><div></div><div>`);
const captureMouse = (e) => {
  e.stopPropagation();
  e.preventDefault();
};
const Filter = (props) => {
  const [open, setOpen] = createSignal(false);
  const [hasChanged, setHasChanged] = createSignal(false);
  const [hasApplied, setHasApplied] = createSignal(false);
  const [draft, setDraft] = createStore({
    ...DEFAULT_FILTERS
  });
  const toggle = () => setOpen((prev) => !prev);
  const updateFilter = (key, value) => {
    setDraft(key, value);
    setHasChanged(!isDefaultFilters(draft));
  };
  const setNumericFilter = (name, v) => updateFilter(name, v === numericStats()[name].min ? void 0 : v);
  const setAgeFilter = (min, max) => {
    updateFilter("age", min === numericStats().age.min && max === numericStats().age.max ? void 0 : {
      min,
      max
    });
  };
  const setPositionFilter = (pos, on) => updateFilter("position", on ? [...draft.position, pos] : draft.position.filter((p) => p !== pos));
  const setNationalityFilter = (countries) => updateFilter("nationality", countries);
  const snapshot = () => ({
    ...draft,
    position: [...draft.position],
    nationality: [...draft.nationality],
    age: draft.age ? {
      ...draft.age
    } : void 0
  });
  const applyFilters = () => {
    props.setAppliedFilters(snapshot());
    setOpen(false);
    setHasChanged(false);
    setHasApplied(!isDefaultFilters(draft));
  };
  const resetFilters = () => {
    if (!hasApplied() && !hasChanged()) return;
    setDraft({
      ...DEFAULT_FILTERS
    });
    props.setAppliedFilters({
      ...DEFAULT_FILTERS
    });
    setHasChanged(false);
    setHasApplied(false);
  };
  return createComponent(Flex, {
    get ["class"]() {
      return styles$6.filter;
    },
    get children() {
      return [createComponent(Flex, {
        get ["class"]() {
          return styles$6["filter-trigger"];
        },
        click: toggle,
        "align-items": "center",
        gap: "0.5rem",
        get children() {
          return [createComponent(BackgroundImage, {
            src: filterIcon,
            get ["class"]() {
              return styles$6["filter-trigger-icon"];
            },
            options: {
              size: "contain",
              position: "center"
            }
          }), getNextElement(_tmpl$$1)];
        }
      }), (() => {
        var _el$2 = getNextElement(_tmpl$5), _el$14 = _el$2.firstChild, [_el$15, _co$2] = getNextMarker(_el$14.nextSibling), _el$4 = _el$15.nextSibling, _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling, [_el$7, _co$] = getNextMarker(_el$6.nextSibling), _el$8 = _el$4.nextSibling, _el$9 = _el$8.nextSibling, _el$0 = _el$9.nextSibling, _el$1 = _el$0.nextSibling, _el$10 = _el$1.nextSibling, _el$11 = _el$10.nextSibling;
        _el$2.$$mousedown = captureMouse;
        insert(_el$2, createComponent(Flex, {
          direction: "column",
          get ["class"]() {
            return styles$6["filter-row"];
          },
          get children() {
            return [(() => {
              var _el$3 = getNextElement(_tmpl$2$1);
              createRenderEffect(() => className(_el$3, styles$6["filter-row-heading"]));
              return _el$3;
            })(), createComponent(Flex, {
              direction: "row",
              "justify-content": "space-between",
              "align-items": "center",
              get children() {
                return createComponent(For, {
                  each: POSITIONS,
                  children: (pos) => createComponent(Toggle, {
                    label: pos,
                    get checked() {
                      return draft.position.includes(pos);
                    },
                    onChange: (v) => setPositionFilter(pos, v)
                  })
                });
              }
            })];
          }
        }), _el$15, _co$2);
        insert(_el$4, createComponent(Dropdown, {
          get value() {
            return draft.nationality;
          },
          onChange: setNationalityFilter
        }), _el$7, _co$);
        insert(_el$8, createComponent(TwoHandleSlider, {
          onChange: (value) => setAgeFilter(value.start, value.end),
          label: "Age",
          get min() {
            return numericStats().age.min;
          },
          get max() {
            return numericStats().age.max;
          },
          get value() {
            return memo(() => !!draft.age)() ? {
              start: draft.age.min,
              end: draft.age.max
            } : {
              start: numericStats().age.min,
              end: numericStats().age.max
            };
          }
        }));
        insert(_el$9, createComponent(Slider, {
          label: "Min Cond.",
          get min() {
            return numericStats().condition.min;
          },
          get max() {
            return numericStats().condition.max;
          },
          get value() {
            return draft.condition ?? numericStats().condition.min;
          },
          onChange: (value) => setNumericFilter("condition", value)
        }));
        insert(_el$0, createComponent(Slider, {
          label: "Min Apps.",
          get min() {
            return numericStats().appearances.min;
          },
          get max() {
            return numericStats().appearances.max;
          },
          get value() {
            return draft.appearances ?? numericStats().appearances.min;
          },
          onChange: (value) => setNumericFilter("appearances", value)
        }));
        insert(_el$1, createComponent(Slider, {
          label: "Min Goals",
          get min() {
            return numericStats().goals.min;
          },
          get max() {
            return numericStats().goals.max;
          },
          get value() {
            return draft.goals ?? numericStats().goals.min;
          },
          onChange: (value) => setNumericFilter("goals", value)
        }));
        insert(_el$10, createComponent(Slider, {
          label: "Min Assists",
          get min() {
            return numericStats().assists.min;
          },
          get max() {
            return numericStats().assists.max;
          },
          get value() {
            return draft.assists ?? numericStats().assists.min;
          },
          onChange: (value) => setNumericFilter("assists", value)
        }));
        insert(_el$11, createComponent(Flex, {
          direction: "row",
          "justify-content": "space-between",
          "align-items": "center",
          gap: "0.5rem",
          get children() {
            return [(() => {
              var _el$12 = getNextElement(_tmpl$3$1);
              _el$12.$$click = applyFilters;
              createRenderEffect(() => className(_el$12, `${styles$6["panel-btn"]} ${!hasChanged() ? styles$6["panel-btn-disabled"] : ""}`));
              runHydrationEvents();
              return _el$12;
            })(), (() => {
              var _el$13 = getNextElement(_tmpl$4$1);
              _el$13.$$click = resetFilters;
              createRenderEffect(() => className(_el$13, `${styles$6["panel-btn"]} ${styles$6["panel-btn-danger"]} ${!(hasApplied() || hasChanged()) ? styles$6["panel-btn-disabled"] : ""}`));
              runHydrationEvents();
              return _el$13;
            })()];
          }
        }));
        createRenderEffect((_p$) => {
          var _v$ = `${styles$6["filter-panel"]} ${open() ? styles$6["filter-panel-open"] : ""}`, _v$2 = styles$6["filter-row"], _v$3 = styles$6["filter-row-heading"], _v$4 = styles$6["filter-row"], _v$5 = styles$6["filter-row"], _v$6 = styles$6["filter-row"], _v$7 = styles$6["filter-row"], _v$8 = styles$6["filter-row"], _v$9 = styles$6["filter-row"];
          _v$ !== _p$.e && className(_el$2, _p$.e = _v$);
          _v$2 !== _p$.t && className(_el$4, _p$.t = _v$2);
          _v$3 !== _p$.a && className(_el$5, _p$.a = _v$3);
          _v$4 !== _p$.o && className(_el$8, _p$.o = _v$4);
          _v$5 !== _p$.i && className(_el$9, _p$.i = _v$5);
          _v$6 !== _p$.n && className(_el$0, _p$.n = _v$6);
          _v$7 !== _p$.s && className(_el$1, _p$.s = _v$7);
          _v$8 !== _p$.h && className(_el$10, _p$.h = _v$8);
          _v$9 !== _p$.r && className(_el$11, _p$.r = _v$9);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0,
          h: void 0,
          r: void 0
        });
        runHydrationEvents();
        return _el$2;
      })()];
    }
  });
};
delegateEvents(["mousedown", "click"]);

const pagination = "_pagination_b2b99_1";
const styles$1 = {
	pagination: pagination,
	"pagination-control": "_pagination-control_b2b99_5",
	"pagination-control-disabled": "_pagination-control-disabled_b2b99_31",
	"page-item": "_page-item_b2b99_36",
	"page-item-selected": "_page-item-selected_b2b99_47"
};

const Pagination = (props) => {
  return createComponent(Pagination$1, {
    ref(r$) {
      var _ref$ = props.ref;
      typeof _ref$ === "function" ? _ref$(r$) : props.ref = r$;
    },
    get ["class"]() {
      return styles$1.pagination;
    },
    get onChange() {
      return props.onChange;
    },
    get pageSize() {
      return props.size;
    },
    get pageIndex() {
      return props.currentPage;
    },
    hasNumbers: true,
    get children() {
      return [createComponent(Pagination$1.Control, {
        get ["class"]() {
          return styles$1["pagination-control"];
        },
        get ["hidden-class"]() {
          return styles$1["pagination-control-disabled"];
        }
      }), createComponent(Pagination$1.Item, {
        get ["class"]() {
          return styles$1["page-item"];
        },
        get ["selected-class"]() {
          return styles$1["page-item-selected"];
        }
      })];
    }
  });
};

const searchIcon = "/_astro/search.DB_oA_nc.svg";

const search = "_search_5ug5v_1";
const styles = {
	search: search,
	"search-input": "_search-input_5ug5v_18",
	"search-icon": "_search-icon_5ug5v_23"
};

const Search = ({
  inputValue,
  onChange
}) => {
  return createComponent(TextInput, {
    get ["class"]() {
      return styles.search;
    },
    onChange,
    value: inputValue,
    delay: true,
    get children() {
      return [createComponent(TextInput.Input, {
        get ["class"]() {
          return styles["search-input"];
        }
      }), createComponent(TextInput.Before, {
        get children() {
          return createComponent(BackgroundImage, {
            src: searchIcon,
            get ["class"]() {
              return styles["search-icon"];
            },
            options: {
              size: "contain",
              position: "center"
            }
          });
        }
      })];
    }
  });
};

var _tmpl$ = /* @__PURE__ */ template(`<span>Squad Roster`), _tmpl$2 = /* @__PURE__ */ template(`<div>`), _tmpl$3 = /* @__PURE__ */ template(`<span>TOTAL PLAYERS: `), _tmpl$4 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const PLAYERS_PER_PAGE = 8;
const INITIAL_PAGE = 1;
const FilterableDataTable = () => {
  const [currentPage, setCurrentPage] = createSignal(INITIAL_PAGE);
  const [appliedFilters, setAppliedFilters] = createSignal(DEFAULT_FILTERS);
  const [inputValue, setInputValue] = createSignal("");
  let paginationRef;
  createEffect(on([appliedFilters, inputValue], () => {
    paginationRef?.changeIndex(1);
  }, {
    defer: true
  }));
  const filteredPlayers = createMemo(() => {
    const filters = appliedFilters();
    const searchFilter = inputValue().toLowerCase().trim();
    return playersState.filter((player) => (searchFilter === "" || player.name.toLowerCase().includes(searchFilter)) && (filters.position.length === 0 || filters.position.includes(player.position)) && (filters.nationality.length === 0 || filters.nationality.includes(player.nationality)) && (filters.age === void 0 || player.age >= filters.age.min && player.age <= filters.age.max) && (filters.condition === void 0 || player.condition >= filters.condition) && (filters.appearances === void 0 || player.appearances >= filters.appearances) && (filters.goals === void 0 || player.goals >= filters.goals) && (filters.assists === void 0 || player.assists >= filters.assists));
  });
  const pageCount = createMemo(() => Math.ceil(filteredPlayers().length / PLAYERS_PER_PAGE));
  const visibleItems = createMemo(() => {
    const startIndex = (currentPage() - 1) * PLAYERS_PER_PAGE;
    return filteredPlayers().slice(startIndex, startIndex + PLAYERS_PER_PAGE);
  });
  return createComponent(Flex, {
    direction: "column",
    get ["class"]() {
      return styles$6.table;
    },
    get children() {
      return [createComponent(Flex, {
        "justify-content": "space-between",
        "align-items": "center",
        get ["class"]() {
          return styles$6.nav;
        },
        get children() {
          return [createComponent(InlineTextBlock, {
            get ["class"]() {
              return styles$6["nav-heading"];
            },
            get children() {
              return [(() => {
                var _el$ = getNextElement(_tmpl$);
                createRenderEffect(() => className(_el$, styles$6["nav-heading-highlight"]));
                return _el$;
              })(), ": Active UNIT List"];
            }
          }), createComponent(Flex, {
            style: {
              flex: 1
            },
            gap: "0.5vmax",
            "justify-content": "end",
            "align-items": "stretch",
            get children() {
              return [createComponent(Search, {
                get inputValue() {
                  return inputValue();
                },
                onChange: setInputValue
              }), createComponent(Filter, {
                setAppliedFilters
              })];
            }
          })];
        }
      }), createComponent(TableHeader, {}), (() => {
        var _el$2 = getNextElement(_tmpl$2);
        insert(_el$2, createComponent(Index, {
          get each() {
            return visibleItems();
          },
          children: (player, index) => createComponent(TableRow, {
            data: player,
            index
          })
        }));
        createRenderEffect(() => className(_el$2, styles$6.body));
        return _el$2;
      })(), (() => {
        var _el$3 = getNextElement(_tmpl$4), _el$5 = _el$3.firstChild, [_el$6, _co$] = getNextMarker(_el$5.nextSibling), _el$7 = _el$6.nextSibling, [_el$8, _co$2] = getNextMarker(_el$7.nextSibling);
        insert(_el$3, createComponent(Pagination, {
          ref: (ref) => paginationRef = ref,
          currentPage: INITIAL_PAGE,
          onChange: setCurrentPage,
          get size() {
            return pageCount();
          }
        }), _el$6, _co$);
        insert(_el$3, createComponent(InlineTextBlock, {
          get ["class"]() {
            return styles$6["footer-total"];
          },
          get children() {
            return [(() => {
              var _el$4 = getNextElement(_tmpl$3);
              createRenderEffect(() => className(_el$4, styles$6["footer-total-highlight"]));
              return _el$4;
            })(), memo(() => playersState.length)];
          }
        }), _el$8, _co$2);
        createRenderEffect(() => className(_el$3, styles$6.footer));
        return _el$3;
      })()];
    }
  });
};

const _1bceuee = (root) => render(() => createComponent(FilterableDataTable, {}), root);

export { _1bceuee as default };
