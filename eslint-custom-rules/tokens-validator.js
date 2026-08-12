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
  TEXTINPUT: 'TextInput',
  PASSWORDINPUT: 'PasswordInput',
  NUMBERINPUT: 'NumberInput',
  PAGINATION: 'Pagination',
  MODAL: 'Modal',
  LIST: 'List',
  LIST_ITEM: 'List.Item',
  CAROUSEL_PAGINATION: 'Carousel.Pagination',
  CAROUSEL_ITEMS: 'Carousel.Items',
  PROGRESS_BAR: 'Progress.Bar',
  PROGRESS_CIRCLE: 'Progress.Circle',
  RADIAL_MENU: 'RadialMenu',
  RADIAL_MENU_INDICATOR: 'RadialMenu.Indicator',
  CHART_PIE: 'Chart.Pie',
  CHART_DONUT: 'Chart.Donut',
  CHART_BAR: 'Chart.Bar',
  CHART_LINE: 'Chart.Line',
  CHART_AREA: 'Chart.Area',
  CHART_SPIDER: 'Chart.Spider',
}

// Legend, Tooltip and Labels work inside any chart type. Add new chart types
// here as they land so the shared slots keep validating.
const chartParents = [
  componentsWithSlotTokens.CHART_PIE,
  componentsWithSlotTokens.CHART_DONUT,
  componentsWithSlotTokens.CHART_BAR,
  componentsWithSlotTokens.CHART_LINE,
  componentsWithSlotTokens.CHART_AREA,
  componentsWithSlotTokens.CHART_SPIDER,
]

// Axes and gridlines only mean something on a cartesian chart.
const cartesianChartParents = [
  componentsWithSlotTokens.CHART_BAR,
  componentsWithSlotTokens.CHART_LINE,
  componentsWithSlotTokens.CHART_AREA,
]

const tokenComponetsParents = {
  'Chart.Legend': chartParents,
  'Chart.Tooltip': chartParents,
  'Chart.Labels': chartParents,
  'Chart.XAxis': cartesianChartParents,
  'Chart.YAxis': cartesianChartParents,
  'Chart.Grid': cartesianChartParents,
  'Chart.Pie.Slice': componentsWithSlotTokens.CHART_PIE,
  'Chart.Donut.Slice': componentsWithSlotTokens.CHART_DONUT,
  'Chart.Donut.Hole': componentsWithSlotTokens.CHART_DONUT,
  'Chart.Bar.Fill': componentsWithSlotTokens.CHART_BAR,
  'Chart.Line.Stroke': componentsWithSlotTokens.CHART_LINE,
  'Chart.Line.Point': componentsWithSlotTokens.CHART_LINE,
  'Chart.Area.Fill': componentsWithSlotTokens.CHART_AREA,
  'Chart.Area.Stroke': componentsWithSlotTokens.CHART_AREA,
  'Chart.Area.Point': componentsWithSlotTokens.CHART_AREA,
  'Chart.Spider.Shape': componentsWithSlotTokens.CHART_SPIDER,
  'Chart.Spider.Web': componentsWithSlotTokens.CHART_SPIDER,
  'Chart.Spider.Axis': componentsWithSlotTokens.CHART_SPIDER,

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
  'TextInput.Before': componentsWithSlotTokens.TEXTINPUT,
  'TextInput.After': componentsWithSlotTokens.TEXTINPUT,
  'TextInput.Input': componentsWithSlotTokens.TEXTINPUT,
  'TextInput.Placeholder': componentsWithSlotTokens.TEXTINPUT,

  'PasswordInput.Before': componentsWithSlotTokens.PASSWORDINPUT,
  'PasswordInput.After': componentsWithSlotTokens.PASSWORDINPUT,
  'PasswordInput.Input': componentsWithSlotTokens.PASSWORDINPUT,
  'PasswordInput.VisibilityButton': componentsWithSlotTokens.PASSWORDINPUT,

  'NumberInput.IncreaseControl': componentsWithSlotTokens.NUMBERINPUT,
  'NumberInput.DecreaseControl': componentsWithSlotTokens.NUMBERINPUT,
  'NumberInput.Input': componentsWithSlotTokens.NUMBERINPUT,
  'NumberInput.Placeholder': componentsWithSlotTokens.NUMBERINPUT,

  'Pagination.Control': componentsWithSlotTokens.PAGINATION,
  'Pagination.Item': componentsWithSlotTokens.PAGINATION,

  'Modal.Overlay': componentsWithSlotTokens.MODAL,
  'Modal.Window': componentsWithSlotTokens.MODAL,

  'List.Item': componentsWithSlotTokens.LIST,
  'List.Icon': componentsWithSlotTokens.LIST_ITEM,

  'Carousel.Item': componentsWithSlotTokens.CAROUSEL_ITEMS,
  'Carousel.Pagination.Control': componentsWithSlotTokens.CAROUSEL_PAGINATION,
  'Carousel.Pagination.Item': componentsWithSlotTokens.CAROUSEL_PAGINATION,

  'Progress.Bar.Fill': componentsWithSlotTokens.PROGRESS_BAR,
  'Progress.Circle.Fill': componentsWithSlotTokens.PROGRESS_CIRCLE,
  'Progress.Circle.Outline': componentsWithSlotTokens.PROGRESS_CIRCLE,
  'Progress.Circle.Text': componentsWithSlotTokens.PROGRESS_CIRCLE,

  'RadialMenu.Content': componentsWithSlotTokens.RADIAL_MENU,
  'RadialMenu.Indicator': componentsWithSlotTokens.RADIAL_MENU,
  'RadialMenu.Indicator.Icon': componentsWithSlotTokens.RADIAL_MENU_INDICATOR,
  'RadialMenu.Selector': componentsWithSlotTokens.RADIAL_MENU,
  'RadialMenu.Item': componentsWithSlotTokens.RADIAL_MENU,
}

const availbleForedTokenComponets = new Set(['Radio.Button', 'Dropdown.Option', 'Segment.Button', 'Stepper.Item', 'Accordion.Panel', 'List.Item', 'Carousel.Item', 'RadialMenu.Item'])

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