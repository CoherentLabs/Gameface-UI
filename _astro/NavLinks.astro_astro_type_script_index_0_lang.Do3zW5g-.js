class SmartNav {
  constructor(navElement) {
    this.container = navElement;
    this.verticalSeparator = navElement.querySelector(
      ".vertical-separator"
    );
    this.fullList = navElement.querySelector(
      ".full-nav-list"
    );
    this.collapsedMenu = navElement.querySelector(
      ".collapsed-menu"
    );
    this.fullListWidth = this.calculateRequiredWidth();
    if (this.fullList.querySelector(".active")) {
      this.collapsedMenu.classList.add("has-active");
    }
    this.handleResize = () => {
      requestAnimationFrame(() => this.check());
    };
    this.check();
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.container);
    const header = this.container.closest(".header");
    if (header) {
      this.resizeObserver.observe(header);
    }
    window.addEventListener("resize", this.handleResize);
  }
  calculateRequiredWidth() {
    const items = Array.from(this.fullList.children);
    if (items.length === 0) return 0;
    let totalWidth = 0;
    items.forEach((item) => {
      totalWidth += item.getBoundingClientRect().width;
    });
    const gap = 24;
    totalWidth += (items.length - 1) * gap;
    return totalWidth + 10;
  }
  check() {
    const header = this.container.closest(".header");
    if (header) {
      header.classList.remove("nav-collapsed");
    }
    const availableWidth = this.container.getBoundingClientRect().width;
    if (availableWidth === 0) return;
    const isCollapsed = availableWidth < this.fullListWidth;
    if (header) {
      header.classList.toggle("nav-collapsed", isCollapsed);
    }
    if (isCollapsed) {
      if (this.verticalSeparator)
        this.verticalSeparator.style.display = "none";
      this.container.style.flexDirection = "row";
      this.fullList.style.display = "none";
      this.collapsedMenu.style.display = "block";
    } else {
      if (this.verticalSeparator)
        this.verticalSeparator.style.display = "block";
      this.container.style.flexDirection = "row";
      this.fullList.style.display = "flex";
      this.collapsedMenu.style.display = "none";
    }
  }
}
const init = () => {
  const nav = document.getElementById("smart-nav");
  if (nav) new SmartNav(nav);
};
document.addEventListener("astro:page-load", init);
document.addEventListener("DOMContentLoaded", init);
