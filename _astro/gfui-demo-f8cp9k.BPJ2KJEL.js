import { q as delegateEvents, a as createSignal, c as createComponent, F as For, g as getNextElement, i as insert, n as createRenderEffect, p as className, P as Portal, v as createUniqueId, t as template, w as runHydrationEvents, r as render } from './web.DT9QqbDn.js';
import { a as Grid, G as GridTile } from './Grid.IrkbD_YA.js';
import { F as Flex } from './Flex.BFF9Zi04.js';
import './LayoutBase.DvNSSl3m.js';
import './BaseComponent.dZiros1M.js';
import './store.CXp9XCH2.js';
import './supportsGamefaceFeature.ByqsM1VI.js';

const styles = {
	"toast-grid": "_toast-grid_4x0ir_1",
	"toast-item": "_toast-item_4x0ir_13"
};

var _tmpl$$1 = /* @__PURE__ */ template(`<div>`);
const INTERVALS = 20;
const GRID_SIZE = 3;
const positions = ["top-left", "top-center", "top-right", "middle-left", "middle-center", "middle-right", "bottom-left", "bottom-center", "bottom-right"];
const useToast = () => {
  const grid = Object.fromEntries(positions.map((pos) => [pos, createSignal([])]));
  const [timers, setTimers] = createSignal({});
  function createToast(options) {
    const {
      position,
      body,
      timeout = 0
    } = options;
    const id = createUniqueId();
    const [_, addToast] = grid[position];
    addToast((prev) => {
      const newGrid = [...prev, {
        id,
        body,
        progress: 0
      }];
      return newGrid;
    });
    if (timeout > 0) {
      const timerID = setInterval(() => {
        setTimers((prev) => {
          const next = {
            ...prev
          };
          if (next[id] >= INTERVALS) {
            removeItem(position, id);
            clearInterval(timerID);
            delete next[id];
          } else {
            next[id] = (next[id] ?? 0) + 1;
          }
          return next;
        });
      }, timeout / INTERVALS);
      setTimers((prev) => ({
        ...prev,
        [id]: 0
      }));
    }
  }
  function removeItem(position, id) {
    const [_, removeToast] = grid[position];
    removeToast((prev) => prev.filter((item) => item.id !== id));
  }
  const Toaster = () => {
    const flexItems = (number) => {
      switch (number) {
        case 0:
          return "start";
        case 1:
          return "center";
        case 2:
          return "end";
        default:
          return "start";
      }
    };
    const direction = (row) => {
      return row === 2 ? "column-reverse" : "column";
    };
    return createComponent(Portal, {
      get mount() {
        return document.querySelector("#root");
      },
      get children() {
        return createComponent(Grid, {
          get ["class"]() {
            return styles["toast-grid"];
          },
          cols: GRID_SIZE,
          rows: GRID_SIZE,
          get children() {
            return createComponent(For, {
              each: positions,
              children: (pos, index) => {
                const [getter] = grid[pos];
                return createComponent(GridTile, {
                  get row() {
                    return Math.floor(index() / GRID_SIZE) + 1;
                  },
                  get col() {
                    return index() % GRID_SIZE + 1;
                  },
                  get children() {
                    return createComponent(Flex, {
                      get ["justify-content"]() {
                        return flexItems(Math.floor(index() / GRID_SIZE));
                      },
                      get ["align-items"]() {
                        return flexItems(index() % GRID_SIZE);
                      },
                      get direction() {
                        return direction(Math.floor(index() / GRID_SIZE));
                      },
                      style: {
                        height: "100%"
                      },
                      get children() {
                        return createComponent(For, {
                          get each() {
                            return getter();
                          },
                          children: (item) => {
                            return (() => {
                              var _el$ = getNextElement(_tmpl$$1);
                              insert(_el$, () => item.body((children) => createComponent(Close, {
                                position: pos,
                                get id() {
                                  return item.id;
                                },
                                children
                              }), () => timers()[item.id], () => removeItem(pos, item.id)));
                              createRenderEffect(() => className(_el$, styles["toast-item"]));
                              return _el$;
                            })();
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  };
  const Close = (props) => {
    const handleClose = () => {
      removeItem(props.position, props.id);
    };
    return (() => {
      var _el$2 = getNextElement(_tmpl$$1);
      _el$2.$$click = handleClose;
      insert(_el$2, () => props.children);
      runHydrationEvents();
      return _el$2;
    })();
  };
  return [Toaster, createToast];
};
delegateEvents(["click"]);

var _tmpl$ = /* @__PURE__ */ template(`<button>Show Toast`);
const App = () => {
  const [Toaster, createToast] = useToast();
  const showToast = () => {
    createToast({
      body: () => "This is a toast message",
      position: "top-right",
      // Position of the toast on the screen
      timeout: 3e3
      // Duration in milliseconds before the toast disappears
    });
  };
  return [(() => {
    var _el$ = getNextElement(_tmpl$);
    _el$.$$click = showToast;
    runHydrationEvents();
    return _el$;
  })(), createComponent(Toaster, {})];
};
const f8cp9k = (root) => render(() => createComponent(App, {}), root);
delegateEvents(["click"]);

export { f8cp9k as default };
