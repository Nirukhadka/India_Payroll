const fs = require('fs');
const data = JSON.parse(fs.readFileSync('docs/GREYTHR-COMPLETE-REFERENCE-INVENTORY.json', 'utf8'));
console.log('Sample item 0:', JSON.stringify(data.items[0], null, 2));
console.log('Modules present:', [...new Set(data.items.map(i => i.module))]);
