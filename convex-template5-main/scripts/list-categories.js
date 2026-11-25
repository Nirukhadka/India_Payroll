const fs = require('fs');

const registryContent = fs.readFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/reports-registry.ts', 'utf8');

const catRegex = /category:\s*"([^"]+)",\s*reports:\s*\[([\s\S]*?)\]\s*\},/g;
let match;
const categories = [];

// Let's count categories
const catHeaderRegex = /category:\s*"([^"]+)",\s*reports:\s*\[/g;
let catMatch;
while ((catMatch = catHeaderRegex.exec(registryContent)) !== null) {
  categories.push(catMatch[1]);
}

console.log('Total categories in registry:', categories.length);
console.log('Categories list:', categories);
