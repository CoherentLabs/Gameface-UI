class StarlightTabs extends HTMLElement {
  // A map of sync keys to all tabs that are synced to that key.
  static #syncedTabs = /* @__PURE__ */ new Map();
  #syncKey;
  // The storage key prefix should be in sync with the one used in the restore script.
  #storageKeyPrefix = "starlight-synced-tabs__";
  constructor() {
    super();
    const tablist = this.querySelector('[role="tablist"]');
    this.tabs = [...tablist.querySelectorAll('[role="tab"]')];
    this.panels = [...this.querySelectorAll(':scope > [role="tabpanel"]')];
    this.#syncKey = this.dataset.syncKey;
    if (this.#syncKey) {
      const syncedTabs = StarlightTabs.#syncedTabs.get(this.#syncKey) ?? [];
      syncedTabs.push(this);
      StarlightTabs.#syncedTabs.set(this.#syncKey, syncedTabs);
    }
    this.tabs.forEach((tab, i) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const currentTab = tablist.querySelector('[aria-selected="true"]');
        if (e.currentTarget !== currentTab) {
          this.switchTab(e.currentTarget, i);
        }
      });
      tab.addEventListener("keydown", (e) => {
        const index = this.tabs.indexOf(e.currentTarget);
        const nextIndex = e.key === "ArrowLeft" ? index - 1 : e.key === "ArrowRight" ? index + 1 : e.key === "Home" ? 0 : e.key === "End" ? this.tabs.length - 1 : null;
        if (nextIndex === null) return;
        if (this.tabs[nextIndex]) {
          e.preventDefault();
          this.switchTab(this.tabs[nextIndex], nextIndex);
        }
      });
    });
  }
  switchTab(newTab, index, shouldSync = true) {
    if (!newTab) return;
    const previousTabsOffset = shouldSync ? this.getBoundingClientRect().top : 0;
    this.tabs.forEach((tab) => {
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
    });
    this.panels.forEach((oldPanel) => {
      oldPanel.hidden = true;
    });
    const newPanel = this.panels[index];
    if (newPanel) newPanel.hidden = false;
    newTab.removeAttribute("tabindex");
    newTab.setAttribute("aria-selected", "true");
    if (shouldSync) {
      newTab.focus();
      StarlightTabs.#syncTabs(this, newTab);
      window.scrollTo({
        top: window.scrollY + (this.getBoundingClientRect().top - previousTabsOffset),
        behavior: "instant"
      });
    }
  }
  #persistSyncedTabs(label) {
    if (!this.#syncKey || typeof localStorage === "undefined") return;
    localStorage.setItem(this.#storageKeyPrefix + this.#syncKey, label);
  }
  static #syncTabs(emitter, newTab) {
    const syncKey = emitter.#syncKey;
    const label = StarlightTabs.#getTabLabel(newTab);
    if (!syncKey || !label) return;
    const syncedTabs = StarlightTabs.#syncedTabs.get(syncKey);
    if (!syncedTabs) return;
    for (const receiver of syncedTabs) {
      if (receiver === emitter) continue;
      const labelIndex = receiver.tabs.findIndex((tab) => StarlightTabs.#getTabLabel(tab) === label);
      if (labelIndex === -1) continue;
      receiver.switchTab(receiver.tabs[labelIndex], labelIndex, false);
    }
    emitter.#persistSyncedTabs(label);
  }
  static #getTabLabel(tab) {
    return tab.textContent?.trim();
  }
}
customElements.define("starlight-tabs", StarlightTabs);
