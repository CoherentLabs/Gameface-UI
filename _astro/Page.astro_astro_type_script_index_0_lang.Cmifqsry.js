const scroller = document.getElementById("starlight__sidebar");
const target = scroller?.querySelector("sl-sidebar-state-persist");
const storageKey = "sl-sidebar-state";
const getState = () => {
  let open = [];
  const hash = target?.dataset.hash || "";
  try {
    const rawStoredState = sessionStorage.getItem(storageKey);
    const storedState = JSON.parse(rawStoredState || "{}");
    if (Array.isArray(storedState.open) && storedState.hash === hash) open = storedState.open;
  } catch {
  }
  return {
    hash,
    open,
    scroll: scroller?.scrollTop || 0
  };
};
const storeState = (state) => {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
  }
};
const updateState = () => storeState(getState());
const setToggleState = (open, detailsIndex) => {
  const state = getState();
  state.open[detailsIndex] = open;
  storeState(state);
};
target?.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const toggledDetails = event.target.closest("summary")?.closest("details");
  if (!toggledDetails) return;
  const restoreElement = toggledDetails.querySelector("sl-sidebar-restore");
  const index = parseInt(restoreElement?.dataset.index || "");
  if (isNaN(index)) return;
  setToggleState(!toggledDetails.open, index);
});
addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") updateState();
});
addEventListener("pageHide", updateState);
