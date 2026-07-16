import { D as createContext, C as useContext, a as createSignal, c as createComponent, m as mergeProps, b as createMemo, o as onMount, x as memo, F as For, g as getNextElement, i as insert, p as createRenderEffect, q as className, s as style, t as template } from './web.e96V-LtU.js';
import { L as LayoutBase } from './LayoutBase.D9nt2oGz.js';
import { w as warnIfUnsupported } from './supportsGamefaceFeature.ByqsM1VI.js';

const GridContext = createContext();

const GridTile = (props) => {
  const gridContext = useContext(GridContext);
  if (!gridContext) throw new Error("GridTile component must be used within a Grid component");
  const {
    placeTile
  } = gridContext;
  const [tile, setTile] = createSignal(null);
  const moveTile = (newRow, newCol) => {
    placeTile(newRow - 1, newCol - 1, tile());
  };
  const removeTile = () => {
    placeTile(props.row - 1, props.col - 1, null);
  };
  const replaceTile = (newTile) => {
    setTile(newTile);
    placeTile(props.row - 1, props.col - 1, tile());
  };
  const gridTileRef = {
    row: props.row,
    col: props.col,
    moveTile,
    removeTile,
    replaceTile
  };
  const initialTile = createComponent(LayoutBase, mergeProps(props, {
    refObject: gridTileRef
  }));
  setTile(initialTile);
  placeTile(props.row - 1, props.col - 1, tile());
  return null;
};

const styles = {
	"Grid-row": "_Grid-row_1otsj_1",
	"Grid-col": "_Grid-col_1otsj_7"
};

var _tmpl$ = /* @__PURE__ */ template(`<div>`);
const Grid = (props) => {
  const initialGrid = Array.from({
    length: props.rows
  }, () => Array.from({
    length: props.cols
  }, () => null));
  const [gridTiles, setGridTiles] = createSignal(initialGrid);
  const placeTile = (row, col, item) => {
    setGridTiles((prev) => {
      const updatedGrid = prev.map((r) => [...r]);
      if (row >= props.rows && col >= props.cols) {
        throw new Error("You are trying to manipulate a non existing grid cell!");
      }
      updatedGrid[row][col] = item;
      return updatedGrid;
    });
  };
  const addItem = (row, col, item) => {
    placeTile(row - 1, col - 1, item);
  };
  const removeItem = (row, col) => {
    placeTile(row - 1, col - 1, null);
  };
  const gridObjectRef = {
    rows: props.rows,
    cols: props.cols,
    addItem,
    removeItem
  };
  const gridStyles = createMemo(() => {
    return {
      gap: props.gap,
      "row-gap": props["row-gap"] ?? props.gap
    };
  });
  const rowStyles = createMemo(() => {
    return {
      "column-gap": props["column-gap"] ?? props.gap,
      ...props["row-style"]
    };
  });
  onMount(() => warnIfUnsupported(props, "gap"));
  return createComponent(LayoutBase, mergeProps(props, {
    get componentClasses() {
      return styles.Grid;
    },
    get componentStyles() {
      return gridStyles();
    },
    refObject: gridObjectRef,
    get children() {
      return createComponent(GridContext.Provider, {
        value: {
          placeTile
        },
        get children() {
          return [memo(() => props.children), createComponent(For, {
            get each() {
              return gridTiles();
            },
            children: (row) => (() => {
              var _el$ = getNextElement(_tmpl$);
              insert(_el$, createComponent(For, {
                each: row,
                children: (cell) => (() => {
                  var _el$2 = getNextElement(_tmpl$);
                  insert(_el$2, cell);
                  createRenderEffect((_p$) => {
                    var _v$3 = `${styles["Grid-col"]} ${props["column-class"] ?? ""}`, _v$4 = props["column-style"];
                    _v$3 !== _p$.e && className(_el$2, _p$.e = _v$3);
                    _p$.t = style(_el$2, _v$4, _p$.t);
                    return _p$;
                  }, {
                    e: void 0,
                    t: void 0
                  });
                  return _el$2;
                })()
              }));
              createRenderEffect((_p$) => {
                var _v$ = `${styles["Grid-row"]} ${props["row-class"] ?? ""}`, _v$2 = rowStyles();
                _v$ !== _p$.e && className(_el$, _p$.e = _v$);
                _p$.t = style(_el$, _v$2, _p$.t);
                return _p$;
              }, {
                e: void 0,
                t: void 0
              });
              return _el$;
            })()
          })];
        }
      });
    }
  }));
};
const Grid$1 = Object.assign(Grid, {
  Tile: GridTile
});

export { GridTile as G, Grid$1 as a };
