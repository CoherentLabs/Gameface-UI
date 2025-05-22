const path = require("node:path");
const fs = require("node:fs");

const componentsWithSlotTokens = {
  Scroll: 'Scroll',
  'Scroll.Bar': 'Scroll.Bar',
  Checkbox: 'Checkbox',
  'Checkbox.Control': 'Checkbox.Control',
}

const tokenComponetsParents = {
  'Scroll.Bar': componentsWithSlotTokens.Scroll,
  'Scroll.Content': componentsWithSlotTokens.Scroll,
  'Scroll.Handle': componentsWithSlotTokens["Scroll.Bar"],
  'Checkbox.Label': componentsWithSlotTokens.Checkbox,
  'Checkbox.Control': componentsWithSlotTokens.Checkbox,
  'Checkbox.Indicator': componentsWithSlotTokens["Checkbox.Control"],
}

const usedComponentsWithSlotTokens = {}

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
function isWrapperUsedProperlyInOtherFiles(context, componentName) {
  const sourceCode = context.getSourceCode();
  const filename = context.getFilename();
  const importDeclaration = findImportDeclaration(sourceCode, componentName);

  if (!importDeclaration) {
    return false; // Component is not imported
  }

  const importedFilePath = resolveImportPath(filename, importDeclaration.source.value);

  if (!fs.existsSync(importedFilePath)) {
    return false; // Imported file does not exist
  }

  const fileContent = fs.readFileSync(importedFilePath, 'utf-8');
  const ast = parse(fileContent, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  let containsScrollBar = false;

  traverse(ast, {
    JSXElement(path) {
      const name = getComponentName(path.node);
      if (name === 'Scroll.Bar') {
        containsScrollBar = true;
        path.stop();
      }
    },
  });

  return containsScrollBar;
}

const componentsTokensWrappers = {};
function isUsedInsideOtherComponent(node, parent, context) {
  const name = getComponentName(node);
  const parentWrapperName = tokenComponetsParents[name];

  if (parent.type === 'ReturnStatement') {
    while (parent && parent.type !== 'VariableDeclarator') parent = parent.parent;
    if (!parent) return false;

    const variableName = parent.id.name;
    const wrapperReferences = findReferencesInAllScopes(context, variableName);
    wrapperReferences.forEach((ref) => {
      let wrapperParent = ref.identifier.parent;

      while (wrapperParent) {
        if (wrapperParent.type === 'JSXElement') {
          const wrapperParentName = getComponentName(wrapperParent);
          if (wrapperParentName === parentWrapperName) return true;
        }
        if (wrapperParent.type === 'ExportDefaultDeclaration') {
          componentsTokensWrappers[variableName] = name;
          return true;
        }
        wrapperParent = wrapperParent.parent;
      }

      if (ref.identifier.parent && ref.identifier.parent !== parent) {
        context.report({
          node: ref.identifier.parent,
          message: `<${parent.id.name}> must be used inside a <${parentWrapperName}> component as direct child because internally uses <${name}>.`,
        });
      }
    });

    return true;
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
        if (isUsedInsideOtherComponent(node, grandParent.parent, context)) return;
      } else {
        if (isUsedAsDirectChild(node, grandParent)) return;
      }
    }
  }

  if (parent.type === 'JSXElement' && getComponentName(parent) === 'Show') {
    if (isUsedAsDirectChild(node, parent.parent)) return;
    if (isUsedInsideOtherComponent(node, parent.parent, context)) return;
  }

  if (isUsedAsDirectChild(node, parent)) return;
  if (isUsedInsideOtherComponent(node, parent, context)) return;

  context.report({
    node,
    message: `<${name}> must be used inside a <${parentWrapperName}>, a valid wrapping component, or conditionally rendered.`,
  });
}

function getWorkspaceRoot(currentFile) {
  let dir = path.dirname(currentFile);

  while (dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      return dir; // Found the workspace root
    }
    dir = path.dirname(dir);
  }

  return process.cwd(); // Fallback to current working directory
}

function getAllFiles(dir, extension) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, extension));
    } else if (filePath.endsWith(extension)) {
      results.push(filePath);
    }
  });

  return results;
}

function getAllComponentsWithSlotsChildren(ast, context, file) {
  traverse(ast, {
    JSXElement(path) {
      const name = getComponentName(path.node);
      componentsWithSlotTokens
      if (name === 'ScrollWrapper') {
        const parent = path.parentPath.node;

        // Check if ScrollWrapper is used inside Scroll
        if (parent.type === 'JSXElement' && getComponentName(parent) === 'Scroll') {
          // Valid case: ScrollWrapper is inside Scroll
          return;
        }

        // Report if ScrollWrapper is not used inside Scroll
        context.report({
          loc: path.node.loc,
          message: `ScrollWrapper in file "${file}" must be used inside a <Scroll> component.`,
        });
      }
    },
  });
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce <Scroll.Bar> to be used inside <Scroll>',
    },
    schema: [],
  },

  create(context) {
    return {
      // Program() {
      //   const workspaceRoot = getWorkspaceRoot(context.getFilename());
      //   const allFiles = getAllFiles(workspaceRoot, '.tsx');

      //   allFiles.forEach((file) => {
      //     const fileContent = fs.readFileSync(file, 'utf-8');
      //     const ast = parse(fileContent, {
      //       sourceType: 'module',
      //       plugins: ['jsx', 'typescript'],
      //     });

      //     getAllComponentsWithSlotsChildren(ast, context, file);
      //   });
      // },
      JSXElement(node) {
        console.log(context.getFilename(), componentsTokensWrappers)
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

function findReferencesInAllScopes(context, variableName) {
  const sourceCode = context.getSourceCode();
  const scopes = sourceCode.scopeManager.scopes; // Get all scopes in the file
  const references = [];

  for (const scope of scopes) {
    const variable = scope.variables.find((v) => v.name === variableName);
    if (variable) {
      references.push(...variable.references);
    }
  }

  return references;
}