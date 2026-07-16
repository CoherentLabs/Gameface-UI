function getSafePosition(rect) {
  const overflows = {
    top: rect.top < 0,
    left: rect.left < 0,
    bottom: rect.bottom > (window.innerHeight || document.documentElement.clientHeight),
    right: rect.right > (window.innerWidth || document.documentElement.clientWidth)
  };
  if (overflows.top && !overflows.bottom) return "bottom";
  if (overflows.bottom && !overflows.top) return "top";
  if (overflows.left && !overflows.right) return "right";
  if (overflows.right && !overflows.left) return "left";
}

export { getSafePosition as g };
