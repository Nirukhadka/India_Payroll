const fs = require('fs');
const path = require('path');

const root = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main';
const masterPath = path.join(root, 'docs/GREYTHR-COMPLETE-REFERENCE-INVENTORY.json');
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
const settingsInv = JSON.parse(fs.readFileSync(path.join(root, 'docs/greythr-canonical-164-inventory.json'), 'utf8'));
const reportsInv = JSON.parse(fs.readFileSync(path.join(root, 'docs/REPORTS-GALLERY-COMPLETE-REFERENCE-INVENTORY.json'), 'utf8'));

// Build lookup map from settings items by title and state
const settingsMap = new Map();
Object.keys(settingsInv.categories).forEach(cat => {
  settingsInv.categories[cat].forEach(s => {
    const key = s.key || s.state;
    settingsMap.set(s.title + '::' + (s.url || s.state), key);
  });
});

// Build lookup map from reports items
const reportsMap = new Map();
reportsInv.inventory.forEach(c => {
  c.reports.forEach(r => {
    reportsMap.set(r.displayName + '::' + r.referenceRoute, r.id);
  });
});

// Assign stable unique IDs
const assignedIds = new Set();
const duplicates = [];

master.items.forEach((item, idx) => {
  let stableId = '';
  if (item.module === 'System Settings') {
    const matchedKey = settingsMap.get(item.name + '::' + item.refUrl);
    stableId = matchedKey ? `settings::${matchedKey}` : `settings::${item.category.toLowerCase().replace(/[^a-z0-9]/g, '_')}::${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  } else if (item.module === 'Reports and Analytics' && item.category.startsWith('Report Category:')) {
    const matchedId = reportsMap.get(item.name + '::' + item.refUrl);
    stableId = matchedId ? `report::${matchedId}` : `report::${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  } else {
    const modSlug = item.module.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const nameSlug = item.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    stableId = `core::${modSlug}::${nameSlug}`;
  }

  // Ensure absolute uniqueness across the 421 entries
  let finalId = stableId;
  let counter = 1;
  while (assignedIds.has(finalId)) {
    counter++;
    finalId = `${stableId}_${counter}`;
  }

  assignedIds.add(finalId);
  item.stableId = finalId;
});

console.log('Total items processed:', master.items.length);
console.log('Total unique stable IDs:', assignedIds.size);

// Save updated inventory with stable IDs
master.metadata.uniqueStableIds = assignedIds.size;
fs.writeFileSync(masterPath, JSON.stringify(master, null, 2), 'utf8');
console.log('Successfully updated docs/GREYTHR-COMPLETE-REFERENCE-INVENTORY.json with 100% unique stable IDs!');

// Re-generate docs/GREYTHR-INDIAPAY-FULL-PARITY-MATRIX.csv with Stable IDs
let csvHeader = "Stable ID,Module,Category,Reference Name,Reference Route,IndiaPay Route,UI Parity,Functionality,Backend,Status,Priority\n";
let csvRows = master.items.map(i => {
  const cleanName = (i.name || "").replace(/"/g, '""');
  const cleanCat = (i.category || "").replace(/"/g, '""');
  return `"${i.stableId}","${i.module}","${cleanCat}","${cleanName}","${i.refUrl}","${i.indiapayRoute}","${i.ui}","${i.func}","${i.backend}","${i.status}","${i.priority}"`;
});
fs.writeFileSync(
  path.join(root, 'docs/GREYTHR-INDIAPAY-FULL-PARITY-MATRIX.csv'),
  csvHeader + csvRows.join("\n"),
  'utf8'
);
console.log('Successfully re-generated docs/GREYTHR-INDIAPAY-FULL-PARITY-MATRIX.csv with Stable ID column!');
