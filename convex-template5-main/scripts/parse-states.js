const fs = require('fs');
const content = fs.readFileSync('docs/greythr-settings-states.js', 'utf8');

const regex = /\.state\(\s*['"]([^'"]+)['"]\s*,\s*\{/g;
let match;
const states = [];

while ((match = regex.exec(content)) !== null) {
  states.push(match[1]);
}

console.log('Total states defined:', states.length);
console.log('States list:\n', JSON.stringify(states, null, 2));

fs.writeFileSync('docs/greythr-settings-all-states.json', JSON.stringify(states, null, 2));
