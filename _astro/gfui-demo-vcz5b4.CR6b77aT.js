import { C as useContext, f as createMemo, g as getNextElement, i as insert, n as createRenderEffect, p as className, s as style, t as template, j as createEffect, u as use, c as createComponent, F as For, H as spread, A as runHydrationEvents, y as delegateEvents, q as getNextMarker, v as Show, D as createContext, a as createSignal, k as on, o as onMount, l as onCleanup, r as render } from './web.bikURqO-.js';
import { F as Flex } from './Flex.89p5zAzD.js';
import { c as createTokenComponent, a as useTokens } from './tokenComponents.ChN_WbXL.js';
import { b as baseComponent, w as waitForFrames, n as navigationActions } from './BaseComponent.C3DpOC_C.js';
import { C as Control, I as Item$1, P as Pagination } from './Pagination.CmQyjbmQ.js';
import './LayoutBase.Crrr9d-c.js';
import './supportsGamefaceFeature.ByqsM1VI.js';
import './store.C9Zlw18N.js';

const carousel = "_carousel_1dp21_1";
const styles = {
	carousel: carousel,
	"carousel-items": "_carousel-items_1dp21_5",
	"carousel-items-container": "_carousel-items-container_1dp21_10",
	"carousel-item": "_carousel-item_1dp21_5",
	"carousel-arrow-disabled": "_carousel-arrow-disabled_1dp21_20",
	"carousel-arrow-next": "_carousel-arrow-next_1dp21_25",
	"carousel-arrow-prev": "_carousel-arrow-prev_1dp21_25"
};

var _tmpl$$5 = /* @__PURE__ */ template(`<div>`);
const CarouselItem = (props) => {
  const carouselContext = useContext(CarouselContext);
  if (!carouselContext) {
    console.error("Carousel.Item must be used inside a Carousel component");
    return null;
  }
  const width = createMemo(() => {
    return carouselContext?.itemWidth();
  });
  const gap = createMemo(() => {
    return carouselContext?.itemGap() / 2;
  });
  const itemSelected = createMemo(() => {
    if (carouselContext.groupItems()) return false;
    return carouselContext.activePage() === props.index();
  });
  const itemClasses = createMemo(() => {
    const classes = [styles["carousel-item"]];
    if (props.item.class) classes.push(props.item.class);
    if (itemSelected()) {
      classes.push(styles["carousel-item-selected"]);
      if (props.item["class-selected"]) classes.push(props.item["class-selected"]);
    }
    return classes.join(" ");
  });
  const itemStyles = createMemo(() => {
    const styles2 = {
      width: width() + "%",
      "margin-right": gap() + "%",
      "margin-left": gap() + "%"
    };
    if (props.item.style) {
      Object.assign(styles2, props.item.style);
    }
    if (itemSelected() && props.item["style-selected"]) {
      Object.assign(styles2, props.item["style-selected"]);
    }
    return styles2;
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$5);
    insert(_el$, () => props.item.children);
    createRenderEffect((_p$) => {
      var _v$ = itemClasses(), _v$2 = itemStyles();
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

var _tmpl$$4 = /* @__PURE__ */ template(`<div><div>`);
const Item = createTokenComponent(true);
const CarouselItems = (props) => {
  const carouselContext = useContext(CarouselContext);
  if (!carouselContext) {
    console.error("Carousel.Items must be used inside a Carousel component");
    return null;
  }
  const carouselItemsContainerClasses = createMemo(() => {
    const classes = [styles["carousel-items-container"]];
    if (props.itemsContainerClass) classes.push(props.itemsContainerClass);
    return classes.join(" ");
  });
  props.componentClasses = () => styles["carousel-items"];
  const ItemsTokens = useTokens(Item, props.children);
  createEffect(() => {
    carouselContext.setItems(ItemsTokens() || []);
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$4), _el$2 = _el$.firstChild;
    use(baseComponent, _el$, () => props);
    var _ref$ = carouselContext.setItemsWrapper;
    typeof _ref$ === "function" ? use(_ref$, _el$) : carouselContext.setItemsWrapper = _el$;
    var _ref$2 = carouselContext.setItemsContainer;
    typeof _ref$2 === "function" ? use(_ref$2, _el$2) : carouselContext.setItemsContainer = _el$2;
    insert(_el$2, createComponent(For, {
      get each() {
        return ItemsTokens();
      },
      children: (item, index) => createComponent(CarouselItem, {
        item,
        index
      })
    }));
    createRenderEffect((_p$) => {
      var _v$ = carouselItemsContainerClasses(), _v$2 = props.itemsContainerStyle;
      _v$ !== _p$.e && className(_el$2, _p$.e = _v$);
      _p$.t = style(_el$2, _v$2, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
};

const CarouselPagination = (props) => {
  const carouselContext = useContext(CarouselContext);
  if (!carouselContext) {
    console.error("Carousel.Pagination must be used inside a Carousel component");
    return null;
  }
  return createComponent(Pagination, {
    ref(r$) {
      var _ref$ = carouselContext.setPaginationRef;
      typeof _ref$ === "function" ? _ref$(r$) : carouselContext.setPaginationRef = r$;
    },
    get pageSize() {
      return carouselContext.pagesCount();
    },
    get pageIndex() {
      return carouselContext.activePage() + 1;
    },
    onChange: (index) => carouselContext.scrollTo(index - 1),
    get style() {
      return props.style;
    },
    get ["class"]() {
      return props.class;
    },
    get children() {
      return props.children;
    }
  });
};
const CarouselPagination$1 = Object.assign(CarouselPagination, {
  Item: Item$1,
  Control
});

var _tmpl$$3 = /*#__PURE__*/template(`<svg width=100% height=100% viewBox="0 0 89 171"fill=none xmlns=http://www.w3.org/2000/svg><path d="M83.8 165.4L5 83.4L44.4 44L83.8 4.60002"stroke=var(--sl-color-gray-3) stroke-width=20 stroke-linecap=round stroke-linejoin=round>`);
const CarouselArrow = (props = {}) => (() => {
  var _el$ = getNextElement(_tmpl$$3);
  spread(_el$, props, true, true);
  runHydrationEvents();
  return _el$;
})();

var _tmpl$$2 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const CarouselNext = (props) => {
  const carouselContext = useContext(CarouselContext);
  if (!carouselContext) {
    console.error("Carousel.Next must be used inside a Carousel component");
    return null;
  }
  const nextArrowClasses = createMemo(() => {
    const classes = [styles["carousel-arrow-next"]];
    if (carouselContext.activePage() === carouselContext.pagesCount() - 1) {
      classes.push(styles["carousel-arrow-disabled"]);
      if (props["class-disabled"]) classes.push(props["class-disabled"]);
    }
    return classes.join(" ");
  });
  props.componentClasses = () => nextArrowClasses();
  return (() => {
    var _el$ = getNextElement(_tmpl$$2), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
    _el$.$$click = (event) => props.click ? props.click(event) : carouselContext.next();
    use(baseComponent, _el$, () => props);
    insert(_el$, createComponent(Show, {
      get when() {
        return props.children;
      },
      get children() {
        return props.children;
      }
    }), _el$3, _co$);
    insert(_el$, createComponent(Show, {
      get when() {
        return !props.children;
      },
      get children() {
        return createComponent(CarouselArrow, {});
      }
    }), _el$5, _co$2);
    runHydrationEvents();
    return _el$;
  })();
};
delegateEvents(["click"]);

var _tmpl$$1 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const CarouselPrev = (props) => {
  const carouselContext = useContext(CarouselContext);
  if (!carouselContext) {
    console.error("Carousel.Prev must be used inside a Carousel component");
    return null;
  }
  const nextArrowClasses = createMemo(() => {
    const classes = [styles["carousel-arrow-prev"]];
    if (carouselContext.activePage() === 0) {
      classes.push(styles["carousel-arrow-disabled"]);
      if (props["class-disabled"]) classes.push(props["class-disabled"]);
    }
    return classes.join(" ");
  });
  props.componentClasses = () => nextArrowClasses();
  return (() => {
    var _el$ = getNextElement(_tmpl$$1), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
    _el$.$$click = (event) => props.click ? props.click(event) : carouselContext.prev();
    use(baseComponent, _el$, () => props);
    insert(_el$, createComponent(Show, {
      get when() {
        return props.children;
      },
      get children() {
        return props.children;
      }
    }), _el$3, _co$);
    insert(_el$, createComponent(Show, {
      get when() {
        return !props.children;
      },
      get children() {
        return createComponent(CarouselArrow, {});
      }
    }), _el$5, _co$2);
    runHydrationEvents();
    return _el$;
  })();
};
delegateEvents(["click"]);

var _tmpl$ = /* @__PURE__ */ template(`<div>`);
const CarouselContext = createContext();
const Carousel = (props) => {
  let resizeObserver;
  let itemsWrapper;
  let itemsContainer;
  let paginationRef;
  let carouselRef;
  const [items, setItems] = createSignal([]);
  const [pagesCount, setPagesCount] = createSignal(0);
  const [activePage, setActivePage] = createSignal(props.groupItems ? 0 : 0);
  const itemWidth = createMemo(() => props.itemWidth || 100);
  const itemGap = createMemo(() => props.itemGap || 0);
  const itemsAlignment = createMemo(() => props.itemsAlignment || "start");
  const groupItems = createMemo(() => !!props.groupItems);
  const leadingAndTrailingSpaces = createMemo(() => props.leadingAndTrailingSpaces === false ? false : true);
  createEffect(on([itemWidth, itemGap, groupItems], () => {
    updatePagesCount();
  }, {
    defer: true
  }));
  const resolveActivePageIndex = (currentItems, previousItems, previousActivePage) => {
    if (!previousItems) return previousActivePage;
    const previouslyActiveItem = previousItems[previousActivePage];
    if (!previouslyActiveItem?._id) return previousActivePage;
    const newIndex = currentItems.findIndex((item) => item._id === previouslyActiveItem._id);
    return newIndex >= 0 ? newIndex : previousActivePage;
  };
  createEffect(on(items, (currentItems, previousItems) => {
    const newlySelectedIndex = currentItems.findIndex((item) => {
      const existedBefore = previousItems?.some((prevItem) => prevItem._id === item._id);
      return item.selected && !existedBefore;
    });
    let nextActivePage;
    if (newlySelectedIndex >= 0) {
      nextActivePage = newlySelectedIndex;
      setActivePage(nextActivePage);
    } else {
      nextActivePage = groupItems() ? activePage() : resolveActivePageIndex(currentItems, previousItems, activePage());
    }
    updatePagesCount();
    scrollTo(nextActivePage, true);
  }, {
    defer: true
  }));
  createEffect(on([itemsAlignment, leadingAndTrailingSpaces], () => waitForFrames(translateItemsContainer), {
    defer: true
  }));
  onMount(() => {
    waitForFrames(translateItemsContainer);
    resizeObserver = new ResizeObserver(translateItemsContainer);
    if (carouselRef) resizeObserver.observe(carouselRef);
    if (!props.ref || !carouselRef) return;
    props.ref({
      element: carouselRef,
      itemsContainer,
      next,
      prev,
      scrollTo,
      activePage,
      pagesCount,
      translateItemsContainer
    });
  });
  onCleanup(() => {
    if (resizeObserver) resizeObserver.disconnect();
  });
  const fixLastItemSelection = () => {
    if (activePage() > pagesCount() - 1) {
      scrollTo(pagesCount() - 1);
    } else {
      translateItemsContainer();
    }
  };
  const updatePagesCount = () => {
    if (!groupItems()) {
      setPagesCount(items().length);
      fixLastItemSelection();
      return;
    }
    waitForFrames(() => {
      const {
        width
      } = itemsWrapper.getBoundingClientRect();
      const itemWidthPx = width * itemWidth() / 100;
      const totalItems = itemsContainer.children.length;
      const itemGapPx = itemGap() / 100 * width;
      const itemsPerPage = Math.floor(width / (itemWidthPx + itemGapPx));
      const pages = Math.ceil(totalItems / itemsPerPage);
      setPagesCount(pages);
      fixLastItemSelection();
    });
  };
  const calculateOffset = (maxScrollOffset, baseOffset, adjustment = 0) => {
    const offset = baseOffset + adjustment;
    return leadingAndTrailingSpaces() && !groupItems() ? offset : Math.max(Math.min(offset, 0), -maxScrollOffset);
  };
  const getScrollOffset = (page, itemWidth2, containerWidth) => {
    const totalItemsWidth = itemWidth2 * items().length;
    const maxScrollOffset = totalItemsWidth - containerWidth;
    if (groupItems()) {
      const itemsPerPage = Math.floor(containerWidth / itemWidth2);
      const groupOffset = -(page * itemsPerPage * itemWidth2);
      switch (itemsAlignment()) {
        case "center": {
          const adjustment = (containerWidth - itemsPerPage * itemWidth2) / 2;
          return calculateOffset(maxScrollOffset, groupOffset, adjustment);
        }
        case "end": {
          const adjustment = containerWidth - itemsPerPage * itemWidth2;
          return calculateOffset(maxScrollOffset, groupOffset, adjustment);
        }
        case "start":
        default: {
          return calculateOffset(maxScrollOffset, groupOffset);
        }
      }
    } else {
      const pageItemOffset = -(itemWidth2 * page);
      switch (itemsAlignment()) {
        case "center": {
          const adjustment = containerWidth / 2 - itemWidth2 / 2;
          return calculateOffset(maxScrollOffset, pageItemOffset, adjustment);
        }
        case "end": {
          const adjustment = containerWidth - itemWidth2;
          return calculateOffset(maxScrollOffset, pageItemOffset, adjustment);
        }
        case "start":
        default: {
          return calculateOffset(maxScrollOffset, pageItemOffset);
        }
      }
    }
  };
  const translateItemsContainer = () => {
    const {
      width
    } = itemsWrapper.getBoundingClientRect();
    const {
      width: containerWidth
    } = itemsContainer.getBoundingClientRect();
    const itemWidthPx = itemWidth() / 100 * containerWidth;
    const itemGapPx = itemGap() / 100 * width;
    const scrollOffset = getScrollOffset(activePage(), itemWidthPx + itemGapPx, width);
    itemsContainer.style.transform = `translateX(${scrollOffset}px)`;
  };
  const scrollTo = (page, force = false) => {
    if (!itemsContainer || page < 0 || page >= pagesCount() || !force && activePage() === page) return;
    setActivePage(page);
    translateItemsContainer();
    props.onActivePageChange?.(page);
    paginationRef?.changeIndex(page + 1);
  };
  const next = () => {
    const currentPage = activePage();
    if (currentPage < pagesCount() - 1) {
      scrollTo(currentPage + 1);
    }
  };
  const prev = () => {
    const currentPage = activePage();
    if (currentPage > 0) {
      scrollTo(currentPage - 1);
    }
  };
  const setItemsContainer = (el) => {
    itemsContainer = el;
  };
  const setItemsWrapper = (el) => {
    itemsWrapper = el;
  };
  const setPaginationRef = (el) => {
    paginationRef = el;
  };
  props.componentClasses = () => styles["carousel"];
  return createComponent(CarouselContext.Provider, {
    value: {
      setActivePage,
      itemWidth,
      itemGap,
      setItems,
      setItemsContainer,
      setPaginationRef,
      activePage,
      pagesCount,
      scrollTo,
      next,
      prev,
      groupItems,
      setItemsWrapper
    },
    get children() {
      var _el$ = getNextElement(_tmpl$);
      use(navigationActions, _el$, () => ({
        anchor: props.anchor,
        ...props.onAction
      }));
      use(baseComponent, _el$, () => props);
      var _ref$ = carouselRef;
      typeof _ref$ === "function" ? use(_ref$, _el$) : carouselRef = _el$;
      insert(_el$, () => props.children);
      return _el$;
    }
  });
};
const Carousel$1 = Object.assign(Carousel, {
  Items: CarouselItems,
  Item,
  Pagination: CarouselPagination$1,
  Next: CarouselNext,
  Prev: CarouselPrev
});

const vcz5b4 = (root) => render(() => createComponent(Carousel$1, {
  style: {
    width: "30rem"
  },
  itemWidth: 40,
  itemGap: 5,
  itemsAlignment: "center",
  get children() {
    return [createComponent(Carousel$1.Items, {
      style: {
        height: "80%"
      },
      get children() {
        return createComponent(For, {
          each: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
          children: (item) => createComponent(Carousel$1.Item, {
            "style-selected": {
              transform: "scale(1.1)",
              border: "0.2rem solid #868599"
            },
            style: {
              overflow: "hidden",
              transition: "transform 300ms",
              "border-radius": "1rem"
            },
            get children() {
              return createComponent(Flex, {
                "align-items": "center",
                "justify-content": "center",
                style: {
                  background: "#3e3d5d",
                  height: "100%"
                },
                children: item
              });
            }
          })
        });
      }
    }), createComponent(Carousel$1.Pagination, {})];
  }
}), root);

export { vcz5b4 as default };
