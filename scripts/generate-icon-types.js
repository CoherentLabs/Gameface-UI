const chokidar = require('chokidar');
const glob = require( 'glob');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = 'src/assets/icons';
const OUTPUT_FILE = 'src/components/Media/Icon/IconTypes.ts';

// Scans the folder and writes the TypeScript interface
function generateIconTypes() {
    const files = glob.globSync(`${ICONS_DIR}/**/*.{png,svg}`);
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

if (!process.argv.includes('--watch')) {
    console.log('🚀 Generation complete.');
    process.exit(0);
}

console.log(`👀 Watching for changes in ${ICONS_DIR}...`);
const watcher = chokidar.watch(ICONS_DIR, { ignoreInitial: true, persistent: true });

let bucket = {
    added: [],
    unlinked: []
};
let debounceTimer = null;

const processBucket = () => {
    const addedCount = bucket.added.length;
    const unlinkedCount = bucket.unlinked.length;

    if (addedCount === 1 && unlinkedCount === 1) {
        const oldName = path.basename(bucket.unlinked[0]);
        const newName = path.basename(bucket.added[0]);
        console.log(`✏️  Renamed: ${oldName} -> ${newName}`);
    }
    else {
        if (unlinkedCount > 0) {
            bucket.unlinked.forEach(f => console.log(`🗑️  Deleted: ${path.basename(f)}`));
        }
        if (addedCount > 0) {
            bucket.added.forEach(f => console.log(`✨ Added: ${path.basename(f)}`));
        }
    }

    // Clear bucket and run generation once
    bucket = { added: [], unlinked: [] };
    generateIconTypes();
};

const triggerUpdate = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(processBucket, 100);
};

watcher
    .on('add', (filePath) => {
        bucket.added.push(filePath);
        triggerUpdate();
    })
    .on('unlink', (filePath) => {
        bucket.unlinked.push(filePath);
        triggerUpdate();
    })
    .on('change', (filePath) => {
        console.log(`🔄 Changed: ${path.basename(filePath)}`);
        generateIconTypes();
    });