function getScrollableParent(el) {
  for (let n = el.parentElement; n; n = n.parentElement) {
    const styles = getComputedStyle(n);
    if (styles.overflowY === "scroll" || styles.overflowX === "scroll") return n;
  }
  return null;
}

export { getScrollableParent as g };
