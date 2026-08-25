const storageKey = "starlight-theme";
function parseTheme(theme) {
  return theme === "auto" || theme === "dark" || theme === "light" ? theme : "auto";
}
function loadTheme() {
  return parseTheme(
    typeof localStorage !== "undefined" && localStorage.getItem(storageKey)
  );
}
function storeTheme(theme) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(
      storageKey,
      theme === "light" || theme === "dark" ? theme : ""
    );
  }
}
function getPreferredColorScheme() {
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
function onThemeChange(theme) {
  StarlightThemeProvider.updatePickers(theme);
  document.documentElement.dataset["theme"] = theme === "auto" ? getPreferredColorScheme() : theme;
  storeTheme(theme);
}
matchMedia(`(prefers-color-scheme: light)`).addEventListener("change", () => {
  if (loadTheme() === "auto") onThemeChange("auto");
});
customElements.define(
  "starlight-coherent-docs-theme-select",
  class CoherentThemeSelect extends HTMLElement {
    constructor() {
      super();
      onThemeChange(loadTheme());
      const button = this.querySelector("button");
      button?.addEventListener("click", () => {
        const theme = parseTheme(document.documentElement.dataset["theme"]);
        const newTheme = theme === "dark" ? "light" : theme === "light" ? "dark" : "auto";
        onThemeChange(newTheme);
        button?.setAttribute("aria-label", `${newTheme} theme`);
      });
    }
  }
);
