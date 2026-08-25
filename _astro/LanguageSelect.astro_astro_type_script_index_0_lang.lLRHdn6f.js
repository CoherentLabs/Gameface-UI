class StarlightLanguageSelect extends HTMLElement {
  constructor() {
    super();
    const select = this.querySelector("select");
    if (select) {
      select.addEventListener("change", (e) => {
        if (e.currentTarget instanceof HTMLSelectElement) {
          window.location.pathname = e.currentTarget.value;
        }
      });
      window.addEventListener("pageshow", (event) => {
        if (!event.persisted) return;
        const markupSelectedIndex = select.querySelector("option[selected]")?.index;
        if (markupSelectedIndex !== select.selectedIndex) {
          select.selectedIndex = markupSelectedIndex ?? 0;
        }
      });
    }
  }
}
customElements.define("starlight-lang-select", StarlightLanguageSelect);
