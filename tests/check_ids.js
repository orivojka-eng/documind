import fs from 'fs';

const appJs = fs.readFileSync('src/app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

// Match document.getElementById("...") or '...'
const regex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
const matches = [];
let match;
while ((match = regex.exec(appJs)) !== null) {
  matches.push(match[1]);
}

const uniqueIds = [...new Set(matches)];
console.log(`Total getElementById calls: ${matches.length}, unique IDs: ${uniqueIds.length}`);

const missing = [];
for (const id of uniqueIds) {
  if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) {
    missing.push(id);
  }
}

if (missing.length === 0) {
  console.log('SUCCESS: All element IDs exist in index.html!');
} else {
  console.log(`WARNING: Found ${missing.length} missing IDs:`);
  missing.forEach(id => console.log(`  - ${id}`));
}

// Also check querySelector and querySelectorAll patterns
const qRegex = /document\.querySelector(?:All)?\(['"]([^'"]+)['"]\)/g;
const qMatches = [];
while ((match = qRegex.exec(appJs)) !== null) {
  qMatches.push(match[1]);
}
const uniqueSelectors = [...new Set(qMatches)];
console.log(`\nTotal querySelector(All) selectors: ${uniqueSelectors.length}`);
uniqueSelectors.forEach(sel => {
  console.log(`  Selector: ${sel}`);
});
