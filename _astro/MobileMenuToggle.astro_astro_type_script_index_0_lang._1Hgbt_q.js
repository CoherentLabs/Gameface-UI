class StarlightMenuButton extends HTMLElement {
  constructor() {
    super();
    this.btn = this.querySelector("button");
    this.btn.addEventListener("click", () => this.toggleExpanded());
    const parentNav = this.closest("nav");
    if (parentNav) {
      parentNav.addEventListener("keyup", (e) => this.closeOnEscape(e));
    }
  }
  setExpanded(expanded) {
    this.setAttribute("aria-expanded", String(expanded));
    document.body.toggleAttribute("data-mobile-menu-expanded", expanded);
  }
  toggleExpanded() {
    this.setExpanded(this.getAttribute("aria-expanded") !== "true");
  }
  closeOnEscape(e) {
    if (e.code === "Escape") {
      this.setExpanded(false);
      this.btn.focus();
    }
  }
}
customElements.define("starlight-menu-button", StarlightMenuButton);
