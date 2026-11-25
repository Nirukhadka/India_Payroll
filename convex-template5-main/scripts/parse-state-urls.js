const fs = require('fs');
const content = fs.readFileSync('docs/greythr-settings-states.js', 'utf8');

const regex = /\.state\(\s*['"]([^'"]+)['"]\s*,\s*\{([^}]+url:\s*['"]([^'"]+)['"][^}]*)\}/g;
let match;
const results = [];

while ((match = regex.exec(content)) !== null) {
  results.push({
    state: match[1],
    url: match[3]
  });
}

console.log('States with URLs found:', results.length);
console.log('Sample:', results.slice(0, 30));

fs.writeFileSync('docs/greythr-settings-state-urls.json', JSON.stringify(results, null, 2));
