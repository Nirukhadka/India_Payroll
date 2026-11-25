const fs = require('fs');
const data = JSON.parse(fs.readFileSync('docs/GREYTHR-COMPLETE-REFERENCE-INVENTORY.json', 'utf8'));
const reportsModule = data.items.filter(i => i.module === 'Reports and Analytics');

const galleryHubs = reportsModule.filter(i => i.stableId.startsWith('core::'));
const reportItems = reportsModule.filter(i => i.stableId.startsWith('report::'));

console.log('Core Hubs count:', galleryHubs.length);
console.log('Report Items count:', reportItems.length);

const categories = {};
reportItems.forEach(r => {
  const cat = r.category.replace('Report Category: ', '');
  categories[cat] = (categories[cat] || 0) + 1;
});

console.log('Distinct Report Categories count:', Object.keys(categories).length);
console.log('Breakdown by category:');
Object.entries(categories).forEach(([k, v]) => console.log(`  - ${k}: ${v} reports`));
