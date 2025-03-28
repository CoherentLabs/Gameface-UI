import fs from "fs";
import path from "path";
import { Plugin } from "vite";
import { parse } from "@babel/parser";
import traverseModule, { NodePath } from "@babel/traverse";
import generateModule from "@babel/generator";
import { JSXAttribute, JSXExpressionContainer, JSXOpeningElement, JSXSpreadAttribute, ObjectProperty } from "@babel/types";

// @ts-ignore
const traverse = traverseModule.default;
// @ts-ignore
const generate = generateModule.default;

/**
 * Extracts the key name from an ObjectProperty node in an Abstract Syntax Tree (AST).
 * 
 * This function handles different types of keys in the ObjectProperty:
 * - If the key is an `Identifier`, it returns the name of the identifier.
 * - If the key is a `StringLiteral`, it returns the string value of the literal.
 * - For any other key type, it returns an empty string.
 * 
 * @param prop - The ObjectProperty node from which to extract the key.
 * @returns The key name as a string, or an empty string if the key type is unsupported.
 */
function getCSSStyleKey(prop: ObjectProperty) {
    switch (prop.key.type) {
        case 'Identifier': return prop.key.name;
        case 'StringLiteral': return prop.key.value;
        default: return '';
    }
}

/**
 * Filters style-related properties from a JSX expression and generates a string of CSS style rules.
 * 
 * @param expression - The JSX expression container's expression to process. 
 *                      It is expected to be of type `ObjectExpression`.
 * @param isBuild - A boolean flag indicating whether the function is being executed in a build environment.
 *                  If `true`, the generated CSS rules will not include extra spaces.
 *                  Defaults to `false`.
 * 
 * @returns A string containing the generated CSS style rules. If the expression is not an `ObjectExpression`,
 *          an empty string is returned.
 * 
 * @remarks
 * - The function modifies the `properties` array of the provided `expression` by filtering out properties
 *   that are successfully converted into CSS rules.
 * - CSS property keys are converted from camelCase to kebab-case.
 * - Only properties with values of type `StringLiteral` or `NumericLiteral` are processed into CSS rules.
 * 
 * @example
 * ```typescript
 * const expression = {
 *   type: "ObjectExpression",
 *   properties: [
 *     { type: "ObjectProperty", key: "backgroundColor", value: { type: "StringLiteral", value: "red" } },
 *     { type: "ObjectProperty", key: "fontSize", value: { type: "NumericLiteral", value: 16 } },
 *   ]
 * };
 * 
 * const styles = filterStylePropsAndGenerateStyles(expression, true);
 * console.log(styles); // Output: "background-color:red;font-size:16;"
 * ```
 */
function filterStylePropsAndGenerateStyles(expression: JSXExpressionContainer['expression'], isBuild = false) {
    if (expression.type !== "ObjectExpression") return '';

    let styleRules = "";

    expression.properties = expression.properties.filter((prop) => {
        if (prop.type !== 'ObjectProperty' ||
            (
                prop.value.type !== "StringLiteral" &&
                prop.value.type !== "NumericLiteral"
            )
        ) return true;

        let key = getCSSStyleKey(prop);
        const value = prop.value.value;
        if (typeof value === "string" || typeof value === "number") {
            key = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
            styleRules += !isBuild ?
                `${key}: ${value}; ` :
                `${key}:${value};`;
            return false;
        }

        return true;
    });

    return styleRules;
}

/**
 * Adds a class name to an existing JSX attribute representing a `class` property.
 * Modifies the `class` attribute value based on its type, appending the new class name
 * or replacing the value if necessary.
 *
 * @param locationInfo - A string containing location information for logging or debugging purposes.
 * @param existingClassAttr - The existing JSX attribute object representing the `class` property.
 * @param className - The class name to be added to the `class` attribute.
 *
 * @remarks
 * - If the `class` attribute value is a `StringLiteral`, the new class name is appended.
 * - If the `class` attribute value is a `JSXExpressionContainer`, a binary expression is created
 *   to concatenate the existing value with the new class name.
 * - If the `class` attribute value is a `JSXElement` or `JSXFragment`, a warning is logged, and
 *   no transformation is applied.
 * - If the `class` attribute value is of any other type, it is replaced with a `StringLiteral`
 *   containing the new class name.
 */
function addClassToJSXAttribute(locationInfo: string, existingClassAttr: JSXAttribute, className: string) {
    switch (existingClassAttr.value?.type) {
        case 'StringLiteral': {
            existingClassAttr.value.value += ` ${className}`;
            break;
        }
        case 'JSXExpressionContainer': {
            existingClassAttr.value.expression = {
                type: "BinaryExpression",
                operator: "+",
                left: existingClassAttr.value.expression.type !== "JSXEmptyExpression"
                    ? existingClassAttr.value.expression
                    : { type: "Identifier", name: "undefined" },
                right: {
                    type: "BinaryExpression",
                    operator: "+",
                    left: {
                        type: "StringLiteral",
                        value: " ",
                    },
                    right: {
                        type: "StringLiteral",
                        value: className,
                    },
                },
            };
            break;
        }
        case 'JSXElement':
        case 'JSXFragment': {
            warn(
                `The JSX element has a "class" attribute with a value of type "${existingClassAttr.value.type}". ` +
                `This combination of "style" and "class" attributes is not supported, so the styles for this element will not be transformed. ${locationInfo}`
            );
            break;
        }
        default: {
            existingClassAttr.value = {
                type: "StringLiteral",
                value: className,
            };
        }
    }
}

/**
 * Adds a CSS class to a JSX element's attributes. If the element already has a `class` attribute,
 * the new class is appended to the existing value. Otherwise, a new `class` attribute is added.
 *
 * @param locationInfo - A string containing location information for debugging or error reporting.
 * @param attributes - An array of JSX attributes, which may include `JSXAttribute` or `JSXSpreadAttribute` objects.
 * @param className - The CSS class name to add to the JSX element.
 */
function addClassToJSXElement(locationInfo: string, attributes: (JSXAttribute | JSXSpreadAttribute)[], className: string) {
    const existingClassAttr = attributes.find((attr) => (attr.type === "JSXAttribute" && attr.name.name === "class"));
    if (existingClassAttr?.type === 'JSXAttribute') return addClassToJSXAttribute(locationInfo, existingClassAttr, className);

    attributes.push({
        type: "JSXAttribute",
        name: { type: "JSXIdentifier", name: "class" },
        value: { type: "StringLiteral", value: className },
    });
}

/**
 * Logs a warning message to the console with a timestamp and plugin-specific formatting.
 * If the environment is not production, the warning is logged again after a short delay.
 *
 * @param message - The warning message to be logged.
 */
function warn(message: string) {
    if (!showWarnings) return;

    const timestamp = new Date().toLocaleTimeString();

    console.warn(`\x1b[2m${timestamp}\x1b[0m \x1b[33m\x1b[1m[vite-style-to-css-plugin]\x1b[0m \x1b[33mwarning:\x1b[0m ${message}`);
    if (process.env.NODE_ENV !== 'production') {
        setTimeout(() => {
            console.warn(`\x1b[2m${timestamp}\x1b[0m \x1b[33m\x1b[1m[vite-style-to-css-plugin]\x1b[0m \x1b[33mwarning:\x1b[0m ${message}`);
        }, 100);
    }
}

/**
 * Transforms inlined `style` attributes in JSX elements into CSS classes and generates corresponding CSS rules.
 * 
 * This function parses the provided code as a JavaScript/TypeScript module with JSX syntax, traverses the AST,
 * and processes JSX elements with `style` attributes. It extracts the inline styles, generates a unique CSS class
 * for each element, and appends the class to the element's attributes. The generated CSS rules are returned as a string.
 * 
 * @param code - The source code containing JSX elements to process.
 * @param isBuild - A flag indicating whether the transformation is for a production build. If `true`, the generated CSS
 *                  will be minified (no extra spaces or newlines).
 * 
 * @returns An object containing:
 * - `ast`: The modified Abstract Syntax Tree (AST) after processing the JSX elements.
 * - `cssOutput`: A string containing the generated CSS rules for the transformed styles.
 */
function transformInlinedStyles(filePath: string, code: string, isBuild = false) {
    let cssOutput = "";
    const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
    });

    traverse(ast, {
        JSXOpeningElement(path: NodePath<JSXOpeningElement>) {
            const { loc } = path.node;
            const locationInfo = loc ? `(${filePath}:${loc.start.line}:${loc.start.column})` : `(${filePath})`;
            const attributes = path.node.attributes;
            // @ts-ignore
            const nodeName = path.node.name.name;

            let styleAttrIndex = attributes.findIndex(
                (attr) => attr.type === "JSXAttribute" && attr.name.name === "style"
            );

            if (styleAttrIndex === -1) return;

            let styleExpr = (attributes[styleAttrIndex] as JSXAttribute).value;
            if (!styleExpr ||
                styleExpr.type !== "JSXExpressionContainer" ||
                styleExpr.expression.type !== "ObjectExpression") return;

            const spreadAttr = attributes.find((attr) => attr.type === "JSXSpreadAttribute");
            if (spreadAttr) {
                warn(
                    `The JSX element <${nodeName}> contains a "style" attribute along with a spread operator ({...${generate(spreadAttr.argument).code}}). ` +
                    `This combination is not supported, so the styles for this element will not be transformed. ${locationInfo}`
                );
                return;
            }

            let className = `_${nodeName}_${Math.random().toString(36).substr(2, 5)}`;

            const styleRules = filterStylePropsAndGenerateStyles(styleExpr.expression, isBuild);
            if (styleRules) {
                cssOutput += !isBuild ?
                    `.${className} { ${styleRules} }\n` :
                    `.${className}{${styleRules}}`;

                addClassToJSXElement(locationInfo, attributes, className);
            }
        },
    });

    return { ast, cssOutput };
}

/**
 * Generates a virtual CSS file identifier based on the provided file path.
 *
 * This function takes the file path of a TypeScript/TSX file, extracts its base name,
 * removes the `.tsx` extension, and constructs a virtual CSS file identifier in the
 * format `virtual:<fileName>-generated-styles.css`.
 *
 * @param id - The file path of the TypeScript/TSX file.
 * @returns The virtual CSS file identifier as a string.
 */
function getVirtualCSSFileId(id: string) {
    const fileName = path.basename(id).replace('.tsx', '');
    return `virtual:${fileName}-generated-styles.css`;
}

/**
 * Handles the transformation of hot-updated files by injecting an import statement
 * for a virtual CSS module if it is not already present in the code.
 *
 * @param id - The identifier of the file being updated.
 * @param virtualCssId - The identifier of the virtual CSS module to be imported.
 * @returns The transformed code with the virtual CSS import statement prepended,
 *          or the original code if no transformation is needed.
 */
function handleHotUpdateTransform(id: string, virtualCssId: string) {
    const code = updatedFiles.get(id)!;
    updatedFiles.delete(id);
    if (!code || code.includes(`import "${virtualCssId}";`)) return code;

    return `import "${virtualCssId}";\n` + code;
}

let showWarnings = true;
const virtualCSSFiles: Map<string, string> = new Map();
const updatedFiles: Map<string, string> = new Map();

export default function solidStyleToCssPlugin({ suppressWarnings } = { suppressWarnings: false }): Plugin {
    let isBuild = false;
    const chunkToCssContent: Map<string, string> = new Map();
    showWarnings = !suppressWarnings;

    return {
        name: "solid-style-to-css",
        configResolved(config) {
            isBuild = config.command === "build";
        },
        transform: {
            order: 'pre',
            /**
             * Handles the transformation of `.tsx` files by processing inlined styles and generating
             * corresponding CSS output.
             *
             * @param code - The source code of the `.tsx` file being processed.
             * @param id - The unique identifier of the file, typically its file path.
             * @returns The transformed code with inlined styles processed. If CSS output is generated,
             *          it may also include an import statement for a virtual CSS file.
             *
             * Behavior:
             * - Skips processing if the file does not have a `.tsx` extension.
             * - During development, checks if the file has been updated and handles hot updates
             *   by delegating to `handleHotUpdateTransform`.
             * - Transforms inlined styles using `transformInlinedStyles` and generates the updated
             *   code and CSS output.
             * - In build mode, stores the CSS output in `chunkToCssContent` for later use.
             * - In development mode, stores the CSS output in `virtualCSSFiles` and ensures the
             *   transformed code includes an import statement for the virtual CSS file.
             */
            handler(code, id) {
                if (!id.endsWith(".tsx")) return;
                const virtualCssId = getVirtualCSSFileId(id);
                if (updatedFiles.has(id)) return handleHotUpdateTransform(id, virtualCssId);

                const { ast, cssOutput } = transformInlinedStyles(id, code, isBuild);
                let transformedCode = generate(ast).code;
                if (!cssOutput) return transformedCode;

                if (isBuild) {
                    chunkToCssContent.set(id, cssOutput);
                    return transformedCode;
                }

                virtualCSSFiles.set(virtualCssId, cssOutput);

                if (!transformedCode.includes(`import "${virtualCssId}";`)) {
                    return `import "${virtualCssId}";\n` + transformedCode;
                }

                return transformedCode;
            }
        },
        resolveId: {
            order: 'post',
            /**
             * Handles the transformation of module IDs during the Vite build process.
             *
             * @param id - The module ID to process.
             * @returns A modified module ID prefixed with `\0` if the current mode is not build (`isBuild` is false)
             *          and the ID starts with 'virtual:'. Otherwise, returns `undefined`.
             */
            handler(id) {
                if (!isBuild && id.startsWith('virtual:')) return `\0${id}`;
            }
        },
        load: {
            order: 'post',
            /**
             * Handles the processing of virtual CSS files during development.
             *
             * @param id - The identifier of the module being processed.
             *             If the module ID starts with '\0virtual:' and the build is not in progress,
             *             it is treated as a virtual CSS file.
             * @returns The content of the virtual CSS file if found in the `virtualCSSFiles` map,
             *          or an empty string if not found.
             */
            handler(id) {
                if (!isBuild && id.startsWith('\0virtual:')) {
                    const virtualCssId = id.slice(1);
                    return virtualCSSFiles.get(virtualCssId) || '';
                }
            }
        },
        /**
         * This function modifies the generated bundle by appending CSS content to 
         * the corresponding CSS assets based on the relationship between JavaScript 
         * chunks and their imported CSS modules.
         *
         * @param _ - The options object for the bundle generation process (not used in this implementation).
         * @param bundle - An object representing the output bundle, where keys are file names 
         * and values are chunk or asset objects.
         *
         * The function performs the following steps:
         * 1. Iterates over all items in the bundle.
         * 2. Filters out non-JavaScript chunks or chunks that do not end with `.js`.
         * 3. Matches JavaScript chunks with their associated CSS content using `chunkToCssContent`.
         * 4. Appends the CSS content to the corresponding CSS assets in the bundle.
         */
        generateBundle(_, bundle) {
            for (const chunk of Object.values(bundle)) {
                if (chunk.type !== "chunk" || !chunk.fileName.endsWith(".js")) continue;

                for (const [moduleId, cssContent] of chunkToCssContent) {
                    if (!chunk.moduleIds.includes(moduleId)) continue;

                    chunk.viteMetadata?.importedCss.forEach((cssModule) => {
                        const cssChunk = bundle[cssModule];
                        if (cssChunk.type === "asset" && cssChunk.fileName.endsWith(".css")) {
                            cssChunk.source += `${cssContent}`;
                        }
                    });
                }
            }
        },
        /**
         * Handles the hot module replacement (HMR) updates for `.tsx` files.
         * 
         * This function is triggered during the HMR process and performs the following:
         * - Checks if the updated file is a `.tsx` file. If not, it exits early.
         * - Reads the file content and processes it to extract inlined styles and transform the code.
         * - Updates the internal maps with the transformed code and extracted CSS output.
         * - Adds the corresponding virtual CSS module to the list of modules to be updated, if applicable.
         * 
         * @param file - The path of the file that was updated.
         * @param server - The Vite server instance, used to access the module graph.
         * @param modules - The list of modules affected by the update.
         * @returns An updated list of modules to be reloaded, including the virtual CSS module if applicable.
         */
        handleHotUpdate({ file, server, modules }) {
            if (!file.endsWith('.tsx')) return;

            const virtualCssId = getVirtualCSSFileId(file);
            const code = fs.readFileSync(file, "utf-8");
            const { ast, cssOutput } = transformInlinedStyles(file, code);
            const transformedCode = generate(ast).code;

            if (!cssOutput) return;

            updatedFiles.set(file, transformedCode);
            virtualCSSFiles.set(virtualCssId, cssOutput);

            const mod = server.moduleGraph.getModuleById(`\0${virtualCssId}`);
            if (mod) return modules.concat(mod)
        }
    };
}
