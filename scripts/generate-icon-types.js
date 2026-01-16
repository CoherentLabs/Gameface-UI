const chokidar = require('chokidar');
const glob = require( 'glob');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = 'src/assets/icons';
const OUTPUT_FILE = 'src/components/Media/Icon/IconTypes.ts';

// Scans the folder and writes the TypeScript interface
function generateIconTypes() {
    console.log('🔄 Detecting icon changes... Building types.');
    
    const files = glob.globSync(`${ICONS_DIR}/**/*.png`);
    const structure = {};
    
    files.forEach((file) => {
        // Normalize path
        const relativePath = path.relative(ICONS_DIR, file).replace(/\\/g, '/');
        // Remove extension (a.png -> a)
        const cleanPath = relativePath.replace(/\.[^/.]+$/, "");
        // ['gamepad', 'xbox', 'a']
        const parts = cleanPath.split('/');
        
        let current = structure;
        parts.forEach((part, index) => {
            if (!current[part]) {
                // If it's the last part, it's a leaf (Component), otherwise it's a branch (Object)
                current[part] = (index === parts.length - 1) ? "COMPONENT" : {};
            }
            current = current[part];
        });
    });
    
    // Recursive function to write the Interface string
    function generateTypeString(obj, indentLevel = 2) {
        const indent = " ".repeat(indentLevel);
        let lines = [];
        
        for (const key in obj) {
            if (obj[key] === "COMPONENT") {
                lines.push(`${indent}${key}: Component<IconProps>;`);
            } else {
                lines.push(`${indent}${key}: {`);
                lines.push(generateTypeString(obj[key], indentLevel + 2));
                lines.push(`${indent}};`);
            }
        }
        return lines.join('\n');
    }
    
    const fileContent = `
// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.

import { Component } from "solid-js";
import { IconProps } from '@components/Media/Icon/Icon';

export interface IconMap {
${generateTypeString(structure)}
}
`;
    
    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`✅ Icon Types generated at ${OUTPUT_FILE}`);
}

generateIconTypes();

const isWatchMode = process.argv.includes('--watch');
if (!isWatchMode) {
    console.log('🚀 Generation complete.');
    return;
}

console.log(`👀 Watching for changes in ${ICONS_DIR}...`);
const watcher = chokidar.watch(ICONS_DIR, {
    ignoreInitial: true,
    persistent: true
});

watcher
    .on('add', () => generateIconTypes())
    .on('unlink', () => generateIconTypes())
    .on('change', () => generateIconTypes())