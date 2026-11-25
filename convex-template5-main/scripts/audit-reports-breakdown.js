const fs = require('fs');
const data = JSON.parse(fs.readFileSync('docs/GREYTHR-COMPLETE-REFERENCE-INVENTORY.json', 'utf8'));
const reports = data.items.filter(item => (item.id && item.id.startsWith('REP-')) || item.module === 'Reports Gallery');
console.log('Total reports in inventory:', reports.length);

const categories = {};
reports.forEach(r => {
  const cat = r.category || 'Uncategorized';
  categories[cat] = (categories[cat] || 0) + 1;
});
console.log('Categories count:', Object.keys(categories).length);
console.log('Categories breakdown:', JSON.stringify(categories, null, 2));

console.log('Sample report:');
console.log(JSON.stringify(reports[0], null, 2));
