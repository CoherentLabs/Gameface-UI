const componentsWithSlotTokens = {
  SCROLL: 'Scroll',
  SCROLL_BAR: 'Scroll.Bar',
  CHECKBOX: 'Checkbox',
  CHECKBOX_CONTROL: 'Checkbox.Control',
  TOGGLE_BUTTON: 'ToggleButton',
  TOGGLE_BUTTON_CONTROL: 'ToggleButton.Control',
  RADIO: 'Radio',
  RADIO_BUTTON: 'Radio.Button',
  RADIO_BUTTON_CONTROL: 'Radio.ButtonControl',
  DROPDOWN: 'Dropdown',
  DROPDOWN_OPTIONS: 'Dropdown.Options',
  STEPPER: 'Stepper',
  STEPPER_ITEMS: 'Stepper.Items',
  SLIDER: 'Slider',
  TEXT_SLIDER: 'TextSlider',
  SEGMENT: 'Segment',
  XYSlider: 'XYSlider',
  ACCORDION: 'Accordion',
  ACCORDION_PANEL: 'Accordion.Panel',
  ACCORDION_HEADING: 'Accordion.Heading',
  TextInput: 'TextInput',
  PasswordInput: 'PasswordInput',
  NumberInput: 'NumberInput',
}

const tokenComponetsParents = {
  'Scroll.Bar': componentsWithSlotTokens.SCROLL,
  'Scroll.Content': componentsWithSlotTokens.SCROLL,
  'Scroll.Handle': componentsWithSlotTokens.SCROLL_BAR,

  'Checkbox.Label': componentsWithSlotTokens.CHECKBOX,
  'Checkbox.Control': componentsWithSlotTokens.CHECKBOX,
  'Checkbox.Indicator': componentsWithSlotTokens.CHECKBOX_CONTROL,

  'ToggleButton.Label': componentsWithSlotTokens.TOGGLE_BUTTON,
  'ToggleButton.Control': componentsWithSlotTokens.TOGGLE_BUTTON,
  'ToggleButton.Handle': componentsWithSlotTokens.TOGGLE_BUTTON_CONTROL,
  'ToggleButton.Indicator': componentsWithSlotTokens.TOGGLE_BUTTON_CONTROL,

  'Radio.Button': componentsWithSlotTokens.RADIO,
  'Radio.ButtonLabel': componentsWithSlotTokens.RADIO_BUTTON,
  'Radio.ButtonControl': componentsWithSlotTokens.RADIO_BUTTON,
  'Radio.ButtonIndicator': componentsWithSlotTokens.RADIO_BUTTON_CONTROL,

  'Dropdown.Options': componentsWithSlotTokens.DROPDOWN,
  'Dropdown.Icon': componentsWithSlotTokens.DROPDOWN,
  'Dropdown.Placeholder': componentsWithSlotTokens.DROPDOWN,
  'Dropdown.Trigger': componentsWithSlotTokens.DROPDOWN,
  'Dropdown.Handle': componentsWithSlotTokens.DROPDOWN,
  'Dropdown.Track': componentsWithSlotTokens.DROPDOWN,
  'Dropdown.Option': componentsWithSlotTokens.DROPDOWN_OPTIONS,

  'Stepper.Control': componentsWithSlotTokens.STEPPER,
  'Stepper.Items': componentsWithSlotTokens.STEPPER,
  'Stepper.Item': componentsWithSlotTokens.STEPPER_ITEMS,

  'Slider.Fill': componentsWithSlotTokens.SLIDER,
  'Slider.Track': componentsWithSlotTokens.SLIDER,
  'Slider.Grid': componentsWithSlotTokens.SLIDER,
  'Slider.Handle': componentsWithSlotTokens.SLIDER,
  'Slider.Thumb': componentsWithSlotTokens.SLIDER,

  'TextSlider.Fill': componentsWithSlotTokens.TEXT_SLIDER,
  'TextSlider.Track': componentsWithSlotTokens.TEXT_SLIDER,
  'TextSlider.Pol': componentsWithSlotTokens.TEXT_SLIDER,
  'TextSlider.Handle': componentsWithSlotTokens.TEXT_SLIDER,
  'TextSlider.Thumb': componentsWithSlotTokens.TEXT_SLIDER,

  'Segment.Button': componentsWithSlotTokens.SEGMENT,
  'Segment.Indicator': componentsWithSlotTokens.SEGMENT,

  'XYSlider.Background': componentsWithSlotTokens.XYSlider,
  'XYSlider.Handle': componentsWithSlotTokens.XYSlider,
  'Accordion.Panel': componentsWithSlotTokens.ACCORDION,
  'Accordion.Heading': componentsWithSlotTokens.ACCORDION_PANEL,
  'Accordion.Icon': componentsWithSlotTokens.ACCORDION_HEADING,
  'Accordion.Body': componentsWithSlotTokens.ACCORDION_PANEL,

  // Before, After, Input, Placeholder
  'TextInput.Before': componentsWithSlotTokens.TextInput,
  'TextInput.After': componentsWithSlotTokens.TextInput,
  'TextInput.Input': componentsWithSlotTokens.TextInput,
  'TextInput.Placeholder': componentsWithSlotTokens.TextInput,

  'PasswordInput.Before': componentsWithSlotTokens.PasswordInput,
  'PasswordInput.After': componentsWithSlotTokens.PasswordInput,
  'PasswordInput.Input': componentsWithSlotTokens.PasswordInput,
  'PasswordInput.VisibilityButton': componentsWithSlotTokens.PasswordInput,

  'NumberInput.IncreaseControl': componentsWithSlotTokens.NumberInput,
  'NumberInput.DecreaseControl': componentsWithSlotTokens.NumberInput,
  'NumberInput.Input': componentsWithSlotTokens.NumberInput,
  'NumberInput.Placeholder': componentsWithSlotTokens.NumberInput,
}

const availbleForedTokenComponets = new Set(['Radio.Button', 'Dropdown.Option', 'Segment.Button', 'Stepper.Item', 'Accordion.Panel'])

function isParentMatchingPath(node, path, wrapperName) {
  let currentNode = node.parent;

  for (const type of path) {
    if (!currentNode || currentNode.type !== type) return false;
    currentNode = currentNode.parent;
  }

  if (wrapperName && getComponentName(currentNode) !== wrapperName) return false;

  return isUsedAsDirectChild(node, wrapperName ? currentNode.parent : currentNode);
}

function isUsedAsDirectChild(node, parent) {
  const name = getComponentName(node);
  const parentWrapperName = tokenComponetsParents[name];

  if (node.type === 'JSXElement' && getComponentName(parent) === parentWrapperName) return true;

  return false;
}

function validateComponent(node, context) {
  const name = getComponentName(node);
  const parentWrapperName = tokenComponetsParents[name];
  if (!parentWrapperName) return;

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
