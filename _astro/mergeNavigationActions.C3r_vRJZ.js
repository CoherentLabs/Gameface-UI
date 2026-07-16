function mergeNavigationActions(props, componentActions = {}) {
  return {
    anchor: props.anchor,
    ...componentActions,
    ...props.onAction || {}
  };
}

export { mergeNavigationActions as m };
