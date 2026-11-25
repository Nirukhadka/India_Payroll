const fs = require('fs');
const data = JSON.parse(fs.readFileSync('docs/GREYTHR-COMPLETE-REFERENCE-INVENTORY.json', 'utf8'));
console.log('Type of data:', typeof data);
console.log('Keys:', Object.keys(data).slice(0, 10));
if (Array.isArray(data.items)) {
  console.log('data.items count:', data.items.length);
}
