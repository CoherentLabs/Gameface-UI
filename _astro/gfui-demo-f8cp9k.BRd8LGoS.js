import { d as delegateEvents, b as createSignal, c as createComponent, F as For, g as getNextElement, i as insert, q as createRenderEffect, s as className, P as Portal, z as createUniqueId, t as template, e as runHydrationEvents, r as render } from './web.PcCDJqbu.js';
import { a as Grid, G as GridTile } from './Grid.BaELt4oI.js';
import { F as Flex } from './Flex.5ir57tMk.js';
import './LayoutBase.BnpdRw2f.js';
import './BaseComponent.BcUYgHqW.js';
import './store.BnPMRy2B.js';
import './supportsGamefaceFeature.92YPCua1.js';
import './gamefaceVersion.ACI438bm.js';

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
      const start = performance.now();
      const timerID = setInterval(() => {
        const elapsedTicks = Math.floor((performance.now() - start) / timeout * INTERVALS);
        setTimers((prev) => {
          const next = {
            ...prev
          };
          if (elapsedTicks >= INTERVALS) {
            removeItem(position, id);
            clearInterval(timerID);
            delete next[id];
          } else {
            next[id] = elapsedTicks;
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
    const justify = (row) => row === 2 ? "start" : flexItems(row);
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
                        return justify(Math.floor(index() / GRID_SIZE));
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
