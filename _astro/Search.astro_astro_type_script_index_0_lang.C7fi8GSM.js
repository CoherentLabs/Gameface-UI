const RESULTS_PAGE_SIZE = 8;
const LOADING_DELAY_MS = 200;
const MIN_VISIBLE_MS = 300;
const MIN_SPLIT_TOKEN_LENGTH = 3;
const INPUT_DEBOUNCE_MS = 250;
const BACK_TO_TOP_THRESHOLD_PX = 400;
let TYPE_VALUES = [];
function splitCompoundQuery(term) {
  if (/\s/.test(term)) return term;
  const split = term.replace(/[._-]+/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]{2,})([A-Z][a-z])/g, "$1 $2").trim();
  if (split === term) return term;
  const filtered = split.split(/\s+/).filter((word) => word.length >= MIN_SPLIT_TOKEN_LENGTH);
  return filtered.length > 0 ? filtered.join(" ") : split;
}
class SiteSearch extends HTMLElement {
  constructor() {
    super();
    const openBtn = this.querySelector("button[data-open-modal]");
    const closeBtn = this.querySelector("button[data-close-modal]");
    const dialog = this.querySelector("dialog");
    const dialogFrame = this.querySelector(".dialog-frame");
    const backToTopBtn = this.querySelector(".coh-back-to-top");
    if (!openBtn || !dialog || !dialogFrame) return;
    let mouseDownOutside = false;
    const isMouseOutsideModal = (target) => {
      return document.body.contains(target) && !dialogFrame.contains(target) && !backToTopBtn?.contains(target);
    };
    const onMouseDown = (event) => {
      mouseDownOutside = isMouseOutsideModal(event.target);
    };
    const onClick = (event) => {
      const isLink = Boolean(event.target?.closest("a"));
      if (isLink || mouseDownOutside && isMouseOutsideModal(event.target)) {
        closeModal();
      }
    };
    const openModal = (event) => {
      dialog.showModal();
      document.body.toggleAttribute("data-search-modal-open", true);
      this.querySelector("input")?.focus();
      event?.stopPropagation();
      window.addEventListener("mousedown", onMouseDown);
      window.addEventListener("click", onClick);
    };
    const closeModal = () => dialog.close();
    openBtn.addEventListener("click", openModal);
    openBtn.disabled = false;
    closeBtn?.addEventListener("click", closeModal);
    dialog.addEventListener("close", () => {
      document.body.toggleAttribute("data-search-modal-open", false);
      window.removeEventListener("mousedown", onMouseDown);
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
    let config;
    try {
      config = JSON.parse(this.dataset.config || "{}");
    } catch {
      console.warn("Failed to parse search config");
      return;
    }
    const shouldStrip = this.dataset.stripTrailingSlash !== void 0;
    const stripTrailingSlash = (path) => path.replace(/(.)\/(#.*)?$/, "$1$2");
    const formatURL = shouldStrip ? stripTrailingSlash : (path) => path;
    window.addEventListener("DOMContentLoaded", () => {
      if (config.searchUnavailable) return;
      const onIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
      onIdle(() => initSearch(this, dialog, translations, formatURL, config));
    });
  }
}
customElements.define("site-search", SiteSearch);
let initialized = false;
const WORKER_INIT_TIMEOUT_MS = 8e3;
async function initSearch(rootEl, dialog, translations, formatURL, config) {
  if (initialized) return;
  initialized = true;
  const container = rootEl.querySelector("#coherent-search");
  if (!container || !dialog) return;
  const worker = new Worker(new URL(/* @vite-ignore */ "/_astro/searchWorker-B7F1uilV.js", import.meta.url), { type: "module" });
  const readyResult = await new Promise((resolve) => {
    const timeout = setTimeout(() => resolve({ ok: false }), WORKER_INIT_TIMEOUT_MS);
    worker.onmessage = (e) => {
      if (e.data.type === "ready") {
        clearTimeout(timeout);
        resolve({ ok: true, typeValues: e.data.typeValues });
      } else if (e.data.type === "initError") {
        clearTimeout(timeout);
        console.warn("Failed to load Pagefind", e.data.message);
        resolve({ ok: false });
      }
    };
    worker.postMessage({
      type: "init",
      baseUrl: config.baseUrl,
      mergeIndexes: config.mergeIndexes || []
    });
  });
  if (!readyResult.ok) {
    worker.terminate();
    return;
  }
  TYPE_VALUES = readyResult.typeValues;
  new CoherentSearchUI(dialog, container, worker, translations, formatURL, config);
}
class CoherentSearchUI {
  constructor(dialog, container, worker, translations, formatURL, config) {
    this.currentResults = [];
    this.tailCount = 0;
    this.visibleCount = RESULTS_PAGE_SIZE;
    this.queryToken = 0;
    this.debounceTimer = null;
    this.loadingShowTimer = null;
    this.contentCommitted = false;
    this.loadingStartedAt = 0;
    this.exactMatchStatus = null;
    this.pendingReplies = /* @__PURE__ */ new Map();
    this.worker = worker;
    this.worker.onmessage = (e) => this.handleWorkerMessage(e.data);
    this.translations = translations || {};
    this.formatURL = formatURL;
    this.container = container;
    this.dialog = dialog;
    this.config = config;
    this.input = container.querySelector(".coh-input");
    this.clearBtn = container.querySelector(".coh-clear");
    this.messageEl = container.querySelector(".coh-message");
    this.refiningIndicatorEl = container.querySelector(".coh-refining-indicator");
    this.resultsEl = container.querySelector(".coh-results");
    this.loadMoreBtn = container.querySelector(".coh-load-more");
    this.backToTopBtn = this.dialog.querySelector(".coh-back-to-top");
    this.loadingBar = this.dialog.querySelector(".coh-loading-bar");
    this.exactMatchToggle = container.querySelector(".coh-exact-match-toggle");
    this.tierEls = {
      documentation: container.querySelector('[data-tier="documentation"]'),
      engine: container.querySelector('[data-tier="engine"]'),
      type: container.querySelector('[data-tier="type"]')
    };
    this.tierGroupEls = {
      engine: container.querySelector('[data-tier-group="engine"]'),
      type: container.querySelector('[data-tier-group="type"]')
    };
    if (this.config.tagManagerId) {
      this.resultsEl.addEventListener("click", (event) => {
        const target = event.target;
        const link = target?.closest(".coh-result-link");
        if (!link || !this.resultsEl.contains(link)) return;
        const li = link.closest("li.coh-result");
        if (!li) return;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "liveSearch",
          searchTerm: this.input.value,
          clickedResult: li.dataset.resultTitle || "",
          clickedUrl: li.dataset.resultUrl || link.getAttribute("href") || ""
        });
      });
    }
    this.state = {
      documentation: config.documentation || null,
      engine: config.engine || null,
      // True only once the user explicitly picks the engine "All" tab, so the
      // Gameface/Prysm -> "Custom Engine" default below doesn't fight that choice.
      engineExplicitlyAll: false,
      types: /* @__PURE__ */ new Set(),
      // Exact-match reordering itself now always runs (see runQuery) — this only
      // controls whether non-exact results get filtered out of the list entirely.
      exactMatchOnly: false
    };
    this.input.addEventListener("input", () => {
      this.clearBtn.classList.toggle("coh-clear--visible", Boolean(this.input.value));
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.runQuery(), INPUT_DEBOUNCE_MS);
    });
    this.clearBtn.addEventListener("click", () => {
      this.input.value = "";
      this.clearBtn.classList.remove("coh-clear--visible");
      this.runQuery();
      this.input.focus();
    });
    this.loadMoreBtn.addEventListener("click", () => this.triggerLoadMore());
    const dialogFrame = this.dialog.querySelector(".dialog-frame");
    this.loadMoreObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !this.loadMoreBtn.hidden && !this.loadMoreBtn.disabled) {
          this.triggerLoadMore();
        }
      },
      { root: dialogFrame, rootMargin: "200px" }
    );
    this.loadMoreObserver.observe(this.loadMoreBtn);
    let scrollCheckQueued = false;
    dialogFrame?.addEventListener(
      "scroll",
      () => {
        if (scrollCheckQueued) return;
        scrollCheckQueued = true;
        requestAnimationFrame(() => {
          scrollCheckQueued = false;
          this.backToTopBtn.hidden = dialogFrame.scrollTop < BACK_TO_TOP_THRESHOLD_PX;
        });
      },
      { passive: true }
    );
    this.backToTopBtn.addEventListener("click", () => {
      dialogFrame?.scrollTo({ top: 0, behavior: "smooth" });
    });
    this.exactMatchToggle.addEventListener("click", () => {
      this.state.exactMatchOnly = !this.state.exactMatchOnly;
      this.exactMatchToggle.classList.toggle(
        "coh-filter-btn--active",
        this.state.exactMatchOnly
      );
      this.exactMatchToggle.setAttribute("aria-pressed", String(this.state.exactMatchOnly));
      this.runQuery();
    });
    this.runQuery();
  }
  refreshAfterMerge() {
    if (this.input.value.trim()) this.runQuery();
  }
  handleWorkerMessage(msg) {
    if (msg.type === "mergeComplete") {
      TYPE_VALUES = msg.typeValues;
      this.refreshAfterMerge();
      return;
    }
    if (msg.type === "warn") return console.warn(msg.message);
    if (msg.type === "ready" || msg.type === "initError") return;
    const key = `${msg.requestId}:${msg.type}`;
    const resolve = this.pendingReplies.get(key);
    if (resolve) {
      this.pendingReplies.delete(key);
      resolve(msg);
    }
  }
  postAndWait(message, expectType) {
    return new Promise((resolve) => {
      this.pendingReplies.set(`${message.requestId}:${expectType}`, resolve);
      this.worker.postMessage(message);
    });
  }
  isLoadingBarVisible() {
    return this.loadingBar.classList.contains("coh-loading-bar--active");
  }
  beginLoading(myToken, onShow) {
    clearTimeout(this.loadingShowTimer);
    this.contentCommitted = false;
    this.loadingShowTimer = setTimeout(() => {
      if (myToken !== this.queryToken) return;
      if (!this.isLoadingBarVisible()) this.loadingStartedAt = performance.now();
      this.loadingBar.classList.add("coh-loading-bar--active");
      if (!this.contentCommitted) onShow?.();
    }, LOADING_DELAY_MS);
  }
  // Call once final content is about to be rendered, so a still-pending loading-bar timer
  // knows not to run its content-clearing side-effect anymore (the bar itself may still show).
  markContentCommitted() {
    this.contentCommitted = true;
  }
  // Cancels a not-yet-shown loading bar outright (no flicker), or, if it did become
  // visible, keeps it up for at least MIN_VISIBLE_MS so it doesn't itself flash too briefly
  // to register. Bails out if a newer query/load-more has since superseded this one.
  // `onDone` runs alongside the bar hiding, e.g. to re-enable the "Load more" button.
  endLoading(myToken, onDone) {
    clearTimeout(this.loadingShowTimer);
    if (!this.isLoadingBarVisible()) return onDone?.();
    const remaining = MIN_VISIBLE_MS - (performance.now() - this.loadingStartedAt);
    const finish = () => {
      if (myToken !== this.queryToken) return;
      this.loadingBar.classList.remove("coh-loading-bar--active");
      onDone?.();
    };
    if (remaining <= 0) return finish();
    setTimeout(finish, remaining);
  }
  async triggerLoadMore() {
    const myToken = this.queryToken;
    this.visibleCount = this.resultsEl.children.length + RESULTS_PAGE_SIZE;
    this.loadMoreBtn.disabled = true;
    this.beginLoading(myToken);
    await this.appendVisibleResults();
    if (myToken !== this.queryToken) return;
    this.endLoading(myToken, () => this.loadMoreBtn.disabled = false);
  }
  formatCount(count, term, hasMore = false) {
    const displayCount = hasMore ? `${count}+` : String(count);
    const key = count === 0 ? "zero_results" : count === 1 ? "one_result" : "many_results";
    const fallback = count === 0 ? `No results for ${term}` : `${displayCount} result${count === 1 ? "" : "s"} for ${term}`;
    const template = this.translations[key] || fallback;
    return template.replace("[SEARCH_TERM]", term).replace("[COUNT]", displayCount);
  }
  exactMatchNote(term) {
    if (!term || !this.state.exactMatchOnly) return "";
    if (!this.exactMatchStatus?.fullyScanned || this.exactMatchStatus.count > 0) return "";
    return ` — no exact match for "${term}"; try turning off Exact match to see related results`;
  }
  makeFilterButton(value, label, active, count, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "coh-filter-btn" + (active ? " coh-filter-btn--active" : "");
    btn.setAttribute("aria-pressed", String(active));
    btn.textContent = count === void 0 ? label : `${label} (${count})`;
    btn.addEventListener("click", () => onClick(value));
    if ((!count || count <= 0) && value !== "All" && !active) btn.disabled = true;
    return btn;
  }
  renderDocumentationTier(counts, hasTerm) {
    const el = this.tierEls.documentation;
    el.innerHTML = "";
    el.appendChild(
      this.makeFilterButton("All", "All", this.state.documentation === null, void 0, () => {
        this.state.documentation = null;
        this.state.engine = null;
        this.state.engineExplicitlyAll = false;
        this.runQuery();
      })
    );
    this.config.documentationValues.forEach((doc) => {
      el.appendChild(
        this.makeFilterButton(
          doc,
          doc,
          this.state.documentation === doc,
          hasTerm ? counts[doc] || 0 : void 0,
          (v) => {
            this.state.documentation = v;
            this.state.engineExplicitlyAll = false;
            this.runQuery();
          }
        )
      );
    });
  }
  renderEngineTier(counts) {
    const el = this.tierEls.engine;
    const applicableEngines = this.config.documentationEngines[this.state.documentation] || [];
    el.innerHTML = "";
    if (applicableEngines.length === 0) {
      this.tierGroupEls.engine.hidden = true;
      return;
    }
    this.tierGroupEls.engine.hidden = false;
    el.appendChild(
      this.makeFilterButton("All", "All", this.state.engine === null, void 0, () => {
        this.state.engine = null;
        this.state.engineExplicitlyAll = true;
        this.runQuery();
      })
    );
    applicableEngines.forEach((eng) => {
      el.appendChild(
        this.makeFilterButton(eng, eng, this.state.engine === eng, counts[eng] || 0, (v) => {
          this.state.engine = v;
          this.state.engineExplicitlyAll = false;
          this.runQuery();
        })
      );
    });
  }
  hideEngineTier() {
    this.tierGroupEls.engine.hidden = true;
    this.tierEls.engine.innerHTML = "";
  }
  renderTypeTier(counts) {
    const el = this.tierEls.type;
    const relevant = TYPE_VALUES.filter((t) => counts[t] > 0);
    el.innerHTML = "";
    if (relevant.length === 0) {
      this.tierGroupEls.type.hidden = true;
      return;
    }
    this.tierGroupEls.type.hidden = false;
    relevant.forEach((t) => {
      el.appendChild(
        this.makeFilterButton(t, t, this.state.types.has(t), counts[t], (v) => {
          if (this.state.types.has(v)) this.state.types.delete(v);
          else this.state.types.add(v);
          this.runQuery();
        })
      );
    });
  }
  hideTypeTier() {
    this.tierGroupEls.type.hidden = true;
    this.tierEls.type.innerHTML = "";
  }
  setRefiningIndicator(isRefining) {
    this.refiningIndicatorEl.hidden = !isRefining;
  }
  async runQuery() {
    const term = this.input.value.trim();
    const myToken = ++this.queryToken;
    this.setRefiningIndicator(false);
    if (!term) {
      clearTimeout(this.loadingShowTimer);
      this.loadingBar.classList.remove("coh-loading-bar--active");
      this.renderDocumentationTier({}, false);
      this.hideEngineTier();
      this.hideTypeTier();
      this.renderResults([], term);
      return;
    }
    this.beginLoading(myToken, () => {
      this.resultsEl.innerHTML = "";
      this.messageEl.textContent = "";
      this.loadMoreBtn.hidden = true;
      this.loadMoreBtn.disabled = false;
    });
    const query = splitCompoundQuery(term);
    const facetCounts = await this.postAndWait(
      {
        type: "facetCounts",
        requestId: myToken,
        query,
        documentation: this.state.documentation,
        engineValues: this.config.engineValues
      },
      "facetCountsResult"
    );
    if (myToken !== this.queryToken) return;
    const documentationCounts = facetCounts.documentationCounts;
    const engineCounts = facetCounts.engineCounts;
    if (this.state.engine && !engineCounts[this.state.engine]) this.state.engine = null;
    if (!this.state.engine && !this.state.engineExplicitlyAll && (this.state.documentation === "Gameface" || this.state.documentation === "Prysm") && engineCounts["Custom Engine"] > 0) {
      this.state.engine = "Custom Engine";
    }
    this.renderDocumentationTier(documentationCounts, true);
    if (this.state.documentation) {
      this.renderEngineTier(engineCounts);
    } else {
      this.hideEngineTier();
    }
    const searchResult = await this.postAndWait(
      {
        type: "search",
        requestId: myToken,
        query,
        exactMatchTerm: term,
        documentation: this.state.documentation,
        engine: this.state.engine,
        types: Array.from(this.state.types),
        typeValues: TYPE_VALUES,
        onlyExact: this.state.exactMatchOnly
      },
      "searchResult"
    );
    if (myToken !== this.queryToken) return;
    Array.from(this.state.types).forEach((t) => {
      if (!searchResult.typeCounts[t]) this.state.types.delete(t);
    });
    if (this.state.documentation) {
      this.renderTypeTier(searchResult.typeCounts);
    } else {
      this.hideTypeTier();
    }
    this.tailCount = searchResult.tailCount;
    this.exactMatchStatus = searchResult.exactMatchStatus;
    this.markContentCommitted();
    await this.renderResults(searchResult.results, term);
    this.endLoading(myToken);
  }
  async renderResults(results, term) {
    this.currentResults = results;
    this.visibleCount = RESULTS_PAGE_SIZE;
    this.messageEl.textContent = term ? this.formatCount(results.length, term, this.tailCount > 0) + this.exactMatchNote(term) : "";
    this.resultsEl.innerHTML = "";
    this.loadMoreBtn.hidden = true;
    this.dialog.querySelector(".dialog-frame")?.scrollTo({ top: 0 });
    this.backToTopBtn.hidden = true;
    if (results.length === 0 && this.tailCount === 0) return;
    await this.appendVisibleResults();
  }
  async appendVisibleResults() {
    const myToken = this.queryToken;
    if (this.currentResults.length <= this.resultsEl.children.length && this.tailCount > 0) {
      const need = Math.max(this.visibleCount - this.currentResults.length, RESULTS_PAGE_SIZE);
      const loadMore = await this.postAndWait(
        { type: "loadMore", requestId: myToken, count: need },
        "loadMoreResult"
      );
      if (myToken !== this.queryToken) return;
      this.currentResults = [...this.currentResults, ...loadMore.results];
      this.tailCount = loadMore.tailCount;
      this.exactMatchStatus = loadMore.exactMatchStatus;
      const term = this.input.value.trim();
      this.messageEl.textContent = this.formatCount(this.currentResults.length, term, this.tailCount > 0) + this.exactMatchNote(term);
    }
    const alreadyRendered = this.resultsEl.children.length;
    const toRender = this.currentResults.slice(alreadyRendered, this.visibleCount);
    if (toRender.length > 0) {
      const fragment = document.createDocumentFragment();
      toRender.forEach((r) => {
        const li = document.createElement("li");
        li.className = "coh-result";
        this.renderResultItem(li, r);
        fragment.appendChild(li);
      });
      this.resultsEl.appendChild(fragment);
    }
    this.loadMoreBtn.hidden = this.resultsEl.children.length >= this.currentResults.length && this.tailCount === 0;
    if (this.translations.load_more) this.loadMoreBtn.textContent = this.translations.load_more;
    else this.loadMoreBtn.textContent = "Load more results";
  }
  renderResultItem(li, r) {
    const url = this.formatURL(r.url);
    li.dataset.resultTitle = r.titleText;
    li.dataset.resultUrl = url;
    li.innerHTML = `
        <a class="coh-result-link" href="${url}">
          <p class="coh-result-title">
            ${r.badgeHtml}<span class="coh-result-title-text">${r.titleHtml}</span>
          </p>
        </a>
        ${r.subResults.map(
      (s) => `
          <a href="${this.formatURL(s.url)}" class="coh-result-sub">
            <span class="coh-result-sub-link">${s.titleHtml}</span>
            <p class="coh-result-sub-excerpt">${s.excerptHtml}</p>
          </a>
        `
    ).join("")}
      `;
  }
}
