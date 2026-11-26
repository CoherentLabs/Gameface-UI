// Which parent each slot token must sit directly under comes from the components' manifests: the slot
// nesting in their `editor` blocks. `npm run gen-registry` writes it to token-parents.json, and CI fails
// when that file is out of date, so the editor and this rule can't disagree.
// A token can have several parents (the shared Chart slots work inside every chart type).
const { parents: tokenComponetsParents, repeatable } = require('./token-parents.json');

// Repeat slots (options, items, panels) may also be rendered by <For> or .map.
const availbleForedTokenComponets = new Set(repeatable);

function isParentMatchingPath(node, path, wrapperName) {
  let currentNode = node.parent;

  for (const type of path) {
    if (!currentNode || currentNode.type !== type) return false;
    currentNode = currentNode.parent;
  }

  if (wrapperName && getComponentName(currentNode) !== wrapperName) return false;

  return isUsedAsDirectChild(node, wrapperName ? currentNode.parent : currentNode);
}

// A slot may be valid under more than one parent - the shared Chart slots work
// inside every chart type - so an entry can be a single name or a list.
function allowedParents(name) {
  const parents = tokenComponetsParents[name];
  if (!parents) return null;

  return Array.isArray(parents) ? parents : [parents];
}

function isUsedAsDirectChild(node, parent) {
  const parentWrapperNames = allowedParents(getComponentName(node));
  if (!parentWrapperNames) return false;

  if (node.type === 'JSXElement' && parentWrapperNames.includes(getComponentName(parent))) return true;

  return false;
}

function validateComponent(node, context) {
  const name = getComponentName(node);
  const parentWrapperNames = allowedParents(name);
  if (!parentWrapperNames) return;

  let parent = node.parent;

  if (parent.type === 'LogicalExpression' && parent.operator === '&&') {
    if (isParentMatchingPath(node, ['LogicalExpression', 'JSXExpressionContainer', 'JSXFragment'])) return;
    if (isParentMatchingPath(node, ['LogicalExpression', 'JSXExpressionContainer'])) return;
  }

  if (parent.type === 'JSXElement' && getComponentName(parent) === 'Show') {
    if (isUsedAsDirectChild(node, parent.parent)) return;
  }

  if (isUsedAsDirectChild(node, parent)) return;

  if (availbleForedTokenComponets.has(name)) {
    // Rendered with For component
    // When arrow function is used without return statement
    if (isParentMatchingPath(node, ['ArrowFunctionExpression', 'JSXExpressionContainer'], 'For')) return;
    // When arrow function is used with return statement
    if (isParentMatchingPath(node, ['ReturnStatement', 'BlockStatement', 'ArrowFunctionExpression', 'JSXExpressionContainer'], 'For')) return;

    // Rendered with .map
    // When arrow function is used without return statement
    if (isParentMatchingPath(node, ['ArrowFunctionExpression', 'CallExpression', 'JSXExpressionContainer'])) return;
    // When arrow function is used with return statement
    if (isParentMatchingPath(node, ['ReturnStatement', 'BlockStatement', 'ArrowFunctionExpression', 'CallExpression', 'JSXExpressionContainer'])) return;
  }

  context.report({
    node,
    message: `<${name}> must be used inside a <${parentWrapperNames.join('> or <')}>.`,
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
    let member = node.openingElement.name;
    let names = [];
    while (member) {
      if (member.type === 'JSXMemberExpression') {
        names.unshift(member.property.name);
        member = member.object;
      } else if (member.type === 'JSXIdentifier') {
        names.unshift(member.name);
        break;
      } else {
        break;
      }
    }
    return names.join('.');
  }
  if (node.openingElement?.name?.type === 'JSXIdentifier') {
    return node.openingElement.name.name;
  }
  return null;
}