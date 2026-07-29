const PAGE_TITLE_ID = "_top";
class StarlightTOC extends HTMLElement {
  constructor() {
    super();
    this._current = this.querySelector('a[aria-current="true"]');
    this.minH = Number.parseInt(this.dataset["minH"] ?? "2", 10);
    this.maxH = Number.parseInt(this.dataset["maxH"] ?? "3", 10);
    /** Test if an element is a table-of-contents heading. */
    this.isHeading = (el) => {
      if (el instanceof HTMLHeadingElement) {
        if (el.id === PAGE_TITLE_ID) return true;
        const level = el.tagName[1];
        if (level) {
          const int = Number.parseInt(level, 10);
          if (int >= this.minH && int <= this.maxH) return true;
        }
      }
      return false;
    };
    const links = [...this.querySelectorAll("a")];
    const getElementHeading = (el) => {
      if (!el) return null;
      const origin = el;
      while (el) {
        if (this.isHeading(el)) return el;
        el = el.previousElementSibling;
        while (el?.lastElementChild) {
          el = el.lastElementChild;
        }
        const h = getElementHeading(el);
        if (h) return h;
      }
      return getElementHeading(origin.parentElement);
    };
    const setCurrent = (entries) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        const heading = getElementHeading(target);
        if (!heading) continue;
        const link = links.find((link2) => link2.hash === `#${encodeURIComponent(heading.id)}`);
        if (link) {
          this.current = link;
          break;
        }
      }
    };
    const toObserve = document.querySelectorAll("main [id], main [id] ~ *, main .content > *");
    let observer;
    const observe = () => {
      if (observer) observer.disconnect();
      observer = new IntersectionObserver(setCurrent, { rootMargin: this.getRootMargin() });
      for (const element of toObserve) observer.observe(element);
    };
    observe();
    const onIdle = globalThis.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    let timeout;
    window.addEventListener("resize", () => {
      if (observer) observer.disconnect();
      clearTimeout(timeout);
      timeout = setTimeout(() => onIdle(observe), 200);
    });
  }
  set current(link) {
    if (link === this._current) return;
    if (this._current) this._current.removeAttribute("aria-current");
    link.setAttribute("aria-current", "true");
    this._current = link;
  }
  get current() {
    return this._current;
  }
  getRootMargin() {
    const navBarHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    const mobileTocHeight = this.querySelector("summary")?.getBoundingClientRect().height ?? 0;
    const top = navBarHeight + mobileTocHeight + 32;
    const bottom = top + 53;
    const height = document.documentElement.clientHeight;
    return `-${top}px 0% ${bottom - height}px`;
  }
}
customElements.define("starlight-toc", StarlightTOC);

const variants = ["caution", "danger", "default", "note", "success", "tip"];
const serializedBadgeDelimiter = "__SHB__";
const serializedBadgeSpaceDelimiter = "__SHB_SPACE__";
function isBadgeVariant(value) {
  return variants.includes(value);
}
function deserializeBadge(value) {
  const serializeBadge2 = value.split(" ").pop();
  if (!serializeBadge2) return;
  const parts = serializeBadge2.split(serializedBadgeDelimiter);
  const [, variant, text] = parts;
  if (!variant || !isBadgeVariant(variant) || !text) return void 0;
  return {
    heading: value.replace(new RegExp(`${serializedBadgeDelimiter}.*${serializedBadgeDelimiter}`), ""),
    text: text.replace(serializedBadgeSpaceDelimiter, " "),
    variant
  };
}

class MobileStarlightTOC extends StarlightTOC {
  set current(link) {
    super.current = link;
    const display = this.querySelector(".display-current");
    if (display) {
      const heading = link.dataset["shbHeading"];
      if (heading) {
        const badge = deserializeBadge(heading);
        if (badge) {
          display.textContent = "";
          display.append(document.createTextNode(`${badge.heading} `));
          const span = document.createElement("span");
          span.textContent = badge.text;
          span.dataset["shbBadge"] = "";
          span.dataset["shbBadgeVariant"] = badge.variant;
          display.append(span);
          return;
        }
      }
      display.textContent = link.textContent;
    }
  }
  get current() {
    return super.current;
  }
  constructor() {
    super();
    const details = this.querySelector("details");
    if (!details) return;
    const closeToC = () => {
      details.open = false;
    };
    for (const link of details.querySelectorAll("a")) {
      link.addEventListener("click", closeToC);
    }
    globalThis.addEventListener("click", (e) => {
      if (!details.contains(e.target)) closeToC();
    });
    globalThis.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && details.open) {
        const hasFocus = details.contains(document.activeElement);
        closeToC();
        if (hasFocus) {
          const summary = details.querySelector("summary");
          if (summary) summary.focus();
        }
      }
    });
  }
}
customElements.define("mobile-starlight-toc", MobileStarlightTOC);
