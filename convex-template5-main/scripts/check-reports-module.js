const fs = require('fs');
const data = JSON.parse(fs.readFileSync('docs/GREYTHR-COMPLETE-REFERENCE-INVENTORY.json', 'utf8'));
const reportsModule = data.items.filter(i => i.module === 'Reports and Analytics');
console.log('Reports and Analytics count:', reportsModule.length);
console.log(JSON.stringify(reportsModule, null, 2));
