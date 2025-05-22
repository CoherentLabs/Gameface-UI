const componentsWithSlotTokens = {
  SCROLL: 'Scroll',
  SCROLL_BAR: 'Scroll.Bar',
  CHECKBOX: 'Checkbox',
  CHECKBOX_CONTROL: 'Checkbox.Control',
}

const tokenComponetsParents = {
  'Scroll.Bar': componentsWithSlotTokens.SCROLL,
  'Scroll.Content': componentsWithSlotTokens.SCROLL,
  'Scroll.Handle': componentsWithSlotTokens.SCROLL_BAR,
  'Checkbox.Label': componentsWithSlotTokens.CHECKBOX,
  'Checkbox.Control': componentsWithSlotTokens.CHECKBOX,
  'Checkbox.Indicator': componentsWithSlotTokens.CHECKBOX_CONTROL,
}

function isUsedAsDirectChild(node, parent) {
  const name = getComponentName(node);
  const parentWrapperName = tokenComponetsParents[name];

  if (node.type === 'JSXElement') {
    const parentName = getComponentName(parent);
    if (parentName === parentWrapperName) {
      return true;
    }
  }

  return false;
}

function validateComponent(node, context) {
  const name = getComponentName(node);
  const parentWrapperName = tokenComponetsParents[name];
  if (!parentWrapperName) return;

  let parent = node.parent;

  if (parent.type === 'LogicalExpression' && parent.operator === '&&') {
    let grandParent = parent.parent;
    if (grandParent.type === 'JSXExpressionContainer') {
      if (grandParent.parent.type === 'JSXFragment') {
        grandParent = grandParent.parent;

        if (isUsedAsDirectChild(node, grandParent)) return;
      } else {
        if (isUsedAsDirectChild(node, grandParent)) return;
      }
    }
  }

  if (parent.type === 'JSXElement' && getComponentName(parent) === 'Show') {
    if (isUsedAsDirectChild(node, parent.parent)) return;
  }

  if (isUsedAsDirectChild(node, parent)) return;

  context.report({
    node,
    message: `<${name}> must be used inside a <${parentWrapperName}>.`,
  });
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce slots to be used inside their parent component',
    },
    schema: [],
  },

  create(context) {
    return {
      JSXElement(node) {
        validateComponent(node, context)
      },
    };
  },
};

function getComponentName(node) {
  if (node.openingElement?.name?.type === 'JSXMemberExpression') {
    return `${node.openingElement.name.object.name}.${node.openingElement.name.property.name}`;
  }
  if (node.openingElement?.name?.type === 'JSXIdentifier') {
    return node.openingElement.name.name;
  }
  return null;
}
