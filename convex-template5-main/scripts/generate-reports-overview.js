const fs = require('fs');

const inventory = JSON.parse(fs.readFileSync('docs/GREYTHR-COMPLETE-REFERENCE-INVENTORY.json', 'utf8'));
const reportItems = inventory.items.filter(i => i.stableId.startsWith('report::'));

// Group by category
const byCat = {};
reportItems.forEach(r => {
  const cat = r.category.replace('Report Category: ', '');
  if (!byCat[cat]) byCat[cat] = [];
  byCat[cat].push({
    id: r.stableId.replace('report::', ''),
    name: r.name,
    refUrl: r.refUrl,
    currentStatus: r.status,
    priority: r.priority
  });
});

console.log('Categories count:', Object.keys(byCat).length);
console.log('Total report items:', reportItems.length);

const categoriesOverview = Object.entries(byCat).map(([cat, items]) => ({
  category: cat,
  count: items.length,
  sampleReports: items.slice(0, 3).map(i => i.name)
}));

console.log(JSON.stringify(categoriesOverview, null, 2));
