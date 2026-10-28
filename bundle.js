/**
 * Standalone Bundler for Haven SillyTavern Extension
 * Combines all modular compiled JavaScript into a single, zero-dependency index.js
 */

import fs from 'fs';
import path from 'path';

const files = [
  'dist/api/pollinations.js',
  'dist/state.js',
  'dist/ui/nav.js',
  'dist/ui/house.js',
  'dist/ui/vn.js',
  'dist/ui/combat.js',
  'dist/ui/tablet.js',
  'dist/llm/prompt.js',
  'dist/index.js',
];

let bundleContent = `/**
 * Haven: Life, Academy & Dungeon Archetype (v2.0)
 * Standalone SillyTavern Extension Bundle
 */
`;

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  // Strip import statements
  code = code.replace(/^\s*import\s+[^;]+;\s*$/gm, '');
  // Strip export statements but keep declarations
  code = code.replace(/^\s*export\s+(class|interface|type|const|let|var|function)\s+/gm, '$1 ');
  code = code.replace(/^\s*export\s+\{[^}]+\};\s*$/gm, '');
  code = code.replace(/^\s*export\s+default\s+[^;]+;\s*$/gm, '');
  bundleContent += `\n/* --- ${path.basename(file)} --- */\n` + code;
}

// Ensure export for SillyTavern module loader
bundleContent += `\nexport default HavenExtension;\n`;

fs.writeFileSync('index.js', bundleContent, 'utf8');
console.log('Single bundle index.js created. Size:', bundleContent.length, 'bytes');
