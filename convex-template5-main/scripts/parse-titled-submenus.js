const fs = require('fs');
const content = fs.readFileSync('docs/greythr-settings-states.js', 'utf8');

// Match pattern:
// i.title="...";k.state("settings.something",{url:"/...", ...
const regex = /i\.title\s*=\s*['"]([^'"]+)['"]\s*;\s*k\.state\(\s*['"]([^'"]+)['"]\s*,\s*\{\s*url\s*:\s*['"]([^'"]+)['"]/g;
let match;
const parsed = [];

while ((match = regex.exec(content)) !== null) {
  parsed.push({
    title: match[1],
    state: match[2],
    url: match[3]
  });
}

console.log('Successfully parsed titled states:', parsed.length);
console.log('Sample parsed:', parsed.slice(0, 30));

fs.writeFileSync('docs/greythr-settings-parsed-submenus.json', JSON.stringify(parsed, null, 2));
