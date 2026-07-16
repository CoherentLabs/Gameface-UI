function clamp(newValue, minValue, maxValue) {
  return Math.min(Math.max(newValue, minValue), maxValue);
}

export { clamp as c };
