const detailsElements = document.querySelectorAll(".crumb-details");
document.addEventListener("click", (e) => {
  const target = e.target;
  if (!target.closest(".dropdown-wrapper")) {
    detailsElements.forEach((details) => {
      details.removeAttribute("open");
      details.closest(".dropdown-wrapper")?.classList.remove("is-ready", "is-overflowing");
    });
  }
});
detailsElements.forEach((details) => {
  const summary = details.querySelector(".crumb-summary");
  const wrapper = details.closest(".dropdown-wrapper");
  const menu = details.querySelector(".dropdown-menu");
  summary.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = details.hasAttribute("open");
    if (isOpen) {
      details.removeAttribute("open");
      wrapper.classList.remove("is-ready", "is-overflowing");
    } else {
      detailsElements.forEach((otherDetails) => {
        if (otherDetails !== details && otherDetails.hasAttribute("open")) {
          otherDetails.removeAttribute("open");
          otherDetails.closest(".dropdown-wrapper")?.classList.remove("is-ready", "is-overflowing");
        }
      });
      details.setAttribute("open", "");
      wrapper.classList.remove("is-overflowing", "is-ready");
      const rect = menu.getBoundingClientRect();
      if (rect.right > window.innerWidth - 20) {
        wrapper.classList.add("is-overflowing");
      }
      wrapper.classList.add("is-ready");
    }
  });
});
window.addEventListener("resize", () => {
  detailsElements.forEach((details) => {
    if (details.hasAttribute("open")) {
      const wrapper = details.closest(
        ".dropdown-wrapper"
      );
      const menu = details.querySelector(
        ".dropdown-menu"
      );
      wrapper.classList.remove("is-overflowing");
      const rect = menu.getBoundingClientRect();
      if (rect.right > window.innerWidth - 20) {
        wrapper.classList.add("is-overflowing");
      }
    }
  });
});
