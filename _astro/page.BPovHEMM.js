const internalFetchHeaders = {};

const prefetchedUrls = /* @__PURE__ */ new Set();
const listenedAnchors = /* @__PURE__ */ new WeakSet();
let prefetchAll = true;
let defaultStrategy = void 0;
let inited = false;
function init(defaultOpts) {
  if (inited) return;
  inited = true;
  prefetchAll ??= false;
  defaultStrategy ??= "hover";
  initTapStrategy();
  initHoverStrategy();
  initViewportStrategy();
  initLoadStrategy();
}
function initTapStrategy() {
  for (const event of ["touchstart", "mousedown"]) {
    document.addEventListener(
      event,
      (e) => {
        if (elMatchesStrategy(e.target, "tap")) {
          prefetch(e.target.href, { ignoreSlowConnection: true });
        }
      },
      { passive: true }
    );
  }
}
function initHoverStrategy() {
  let timeout;
  document.body.addEventListener(
    "focusin",
    (e) => {
      if (elMatchesStrategy(e.target, "hover")) {
        handleHoverIn(e);
      }
    },
    { passive: true }
  );
  document.body.addEventListener("focusout", handleHoverOut, { passive: true });
  onPageLoad(() => {
    for (const anchor of document.getElementsByTagName("a")) {
      if (listenedAnchors.has(anchor)) continue;
      if (elMatchesStrategy(anchor, "hover")) {
        listenedAnchors.add(anchor);
        anchor.addEventListener("mouseenter", handleHoverIn, { passive: true });
        anchor.addEventListener("mouseleave", handleHoverOut, { passive: true });
      }
    }
  });
  function handleHoverIn(e) {
    const href = e.target.href;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      prefetch(href);
    }, 80);
  }
  function handleHoverOut() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = 0;
    }
  }
}
function initViewportStrategy() {
  let observer;
  onPageLoad(() => {
    for (const anchor of document.getElementsByTagName("a")) {
      if (listenedAnchors.has(anchor)) continue;
      if (elMatchesStrategy(anchor, "viewport")) {
        listenedAnchors.add(anchor);
        observer ??= createViewportIntersectionObserver();
        observer.observe(anchor);
      }
    }
  });
}
function createViewportIntersectionObserver() {
  const timeouts = /* @__PURE__ */ new WeakMap();
  return new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      const anchor = entry.target;
      const timeout = timeouts.get(anchor);
      if (entry.isIntersecting) {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeouts.set(
          anchor,
          setTimeout(() => {
            observer.unobserve(anchor);
            timeouts.delete(anchor);
            prefetch(anchor.href);
          }, 300)
        );
      } else {
        if (timeout) {
          clearTimeout(timeout);
          timeouts.delete(anchor);
        }
      }
    }
  });
}
function initLoadStrategy() {
  onPageLoad(() => {
    for (const anchor of document.getElementsByTagName("a")) {
      if (elMatchesStrategy(anchor, "load")) {
        prefetch(anchor.href);
      }
    }
  });
}
function prefetch(url, opts) {
  url = url.replace(/#.*/, "");
  const ignoreSlowConnection = opts?.ignoreSlowConnection ?? false;
  if (!canPrefetchUrl(url, ignoreSlowConnection)) return;
  prefetchedUrls.add(url);
  if (document.createElement("link").relList?.supports?.("prefetch") && opts?.with !== "fetch") {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.setAttribute("href", url);
    document.head.append(link);
  } else {
    const headers = new Headers();
    for (const [key, value] of Object.entries(internalFetchHeaders)) {
      headers.set(key, value);
    }
    fetch(url, { priority: "low", headers });
  }
}
function canPrefetchUrl(url, ignoreSlowConnection) {
  if (!navigator.onLine) return false;
  if (!ignoreSlowConnection && isSlowConnection()) return false;
  try {
    const urlObj = new URL(url, location.href);
    return location.origin === urlObj.origin && (location.pathname !== urlObj.pathname || location.search !== urlObj.search) && !prefetchedUrls.has(url);
  } catch {
  }
  return false;
}
function elMatchesStrategy(el, strategy) {
  if (el?.tagName !== "A") return false;
  const attrValue = el.dataset.astroPrefetch;
  if (attrValue === "false") {
    return false;
  }
  if (strategy === "tap" && (attrValue != null || prefetchAll) && isSlowConnection()) {
    return true;
  }
  if (attrValue == null && prefetchAll || attrValue === "") {
    return strategy === defaultStrategy;
  }
  if (attrValue === strategy) {
    return true;
  }
  return false;
}
function isSlowConnection() {
  if ("connection" in navigator) {
    const conn = navigator.connection;
    return conn.saveData || /2g/.test(conn.effectiveType);
  }
  return false;
}
function onPageLoad(cb) {
  cb();
  let firstLoad = false;
  document.addEventListener("astro:page-load", () => {
    if (!firstLoad) {
      firstLoad = true;
      return;
    }
    cb();
  });
}

init();
