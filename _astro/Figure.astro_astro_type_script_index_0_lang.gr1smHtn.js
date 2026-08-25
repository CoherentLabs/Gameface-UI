function setupFigureLoaders() {
  const wrappers = document.querySelectorAll(".figure-img-wrapper");
  wrappers.forEach((wrapper) => {
    const img = wrapper.querySelector("img");
    if (!img) return;
    if (img.complete) {
      wrapper.classList.add("is-loaded");
    } else {
      img.addEventListener(
        "load",
        () => wrapper.classList.add("is-loaded")
      );
      img.addEventListener(
        "error",
        () => wrapper.classList.add("is-loaded")
      );
    }
  });
}
document.addEventListener("astro:page-load", setupFigureLoaders);
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupFigureLoaders);
} else {
  setupFigureLoaders();
}
