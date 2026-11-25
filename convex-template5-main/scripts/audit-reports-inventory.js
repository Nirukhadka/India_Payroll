const fs = require('fs');
const path = require('path');

const refInventoryPath = 'docs/GREYTHR-COMPLETE-REFERENCE-INVENTORY.json';
if (fs.existsSync(refInventoryPath)) {
  const data = JSON.parse(fs.readFileSync(refInventoryPath, 'utf8'));
  console.log('Total reference items:', data.length);
  const reports = data.filter(item => (item.id && item.id.startsWith('REP-')) || item.module === 'Reports Gallery');
  console.log('Total reports in inventory:', reports.length);
  const categories = {};
  reports.forEach(r => {
    const cat = r.category || 'Uncategorized';
    categories[cat] = (categories[cat] || 0) + 1;
  });
  console.log('Categories count:', Object.keys(categories).length);
  console.log('Categories breakdown:', JSON.stringify(categories, null, 2));
} else {
  console.log('Not found:', refInventoryPath);
}
