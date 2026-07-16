const scriptRel = 'modulepreload';const assetsURL = function(dep) { return "/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (true               && deps && deps.length > 0) {
    let allSettled2 = function(promises) {
      return Promise.all(
        promises.map(
          (p) => Promise.resolve(p).then(
            (value) => ({ status: "fulfilled", value }),
            (reason) => ({ status: "rejected", reason })
          )
        )
      );
    };
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled2(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};

const pagefindUserConfig = {"indexWeight":2,"ranking":{"pageLength":0.1,"termFrequency":0.1,"termSaturation":2,"termSimilarity":9}};

class SiteSearch extends HTMLElement {
  constructor() {
    super();
    const openBtn = this.querySelector("button[data-open-modal]");
    const closeBtn = this.querySelector("button[data-close-modal]");
    const dialog = this.querySelector("dialog");
    const dialogFrame = this.querySelector(".dialog-frame");
    const onClick = (event) => {
      const isLink = "href" in (event.target || {});
      if (isLink || document.body.contains(event.target) && !dialogFrame.contains(event.target)) {
        closeModal();
      }
    };
    const openModal = (event) => {
      dialog.showModal();
      document.body.toggleAttribute("data-search-modal-open", true);
      this.querySelector("input")?.focus();
      event?.stopPropagation();
      window.addEventListener("click", onClick);
    };
    const closeModal = () => dialog.close();
    openBtn.addEventListener("click", openModal);
    openBtn.disabled = false;
    closeBtn.addEventListener("click", closeModal);
    dialog.addEventListener("close", () => {
      document.body.toggleAttribute("data-search-modal-open", false);
      window.removeEventListener("click", onClick);
    });
    window.addEventListener("keydown", (e) => {
      if ((e.metaKey === true || e.ctrlKey === true) && e.key === "k") {
        dialog.open ? closeModal() : openModal();
        e.preventDefault();
      }
    });
    let translations = {};
    try {
      translations = JSON.parse(this.dataset.translations || "{}");
    } catch {
    }
    const shouldStrip = this.dataset.stripTrailingSlash !== void 0;
    const stripTrailingSlash = (path) => path.replace(/(.)\/(#.*)?$/, "$1$2");
    const formatURL = shouldStrip ? stripTrailingSlash : (path) => path;
    window.addEventListener("DOMContentLoaded", () => {
      const onIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
      onIdle(async () => {
        const { PagefindUI } = await __vitePreload(async () => { const { PagefindUI } = await import('./ui-core.D1NfKOXp.js');return { PagefindUI }},true              ?[]:void 0);
        new PagefindUI({
          ...pagefindUserConfig,
          element: "#starlight__search",
          baseUrl: "/",
          bundlePath: "/".replace(/\/$/, "") + "/pagefind/",
          showImages: false,
          translations,
          showSubResults: true,
          processResult: (result) => {
            result.url = formatURL(result.url);
            result.sub_results = result.sub_results.map((sub_result) => {
              sub_result.url = formatURL(sub_result.url);
              return sub_result;
            });
          }
        });
      });
    });
  }
}
customElements.define("site-search", SiteSearch);

export { __vitePreload as _ };
