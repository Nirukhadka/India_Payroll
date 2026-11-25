const fs = require('fs');

const inventory = JSON.parse(fs.readFileSync('docs/GREYTHR-COMPLETE-REFERENCE-INVENTORY.json', 'utf8'));
const reportItems = inventory.items.filter(i => i.stableId.startsWith('report::'));
const registryContent = fs.readFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/reports-registry.ts', 'utf8');

const reportRegex = /id:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
let match;
const registryMap = new Map();
while ((match = reportRegex.exec(registryContent)) !== null) {
  registryMap.set(match[1], match[2]);
}

let matched = 0;
let missing = [];
reportItems.forEach(r => {
  const cleanId = r.stableId.replace('report::', '');
  if (registryMap.has(cleanId)) {
    matched++;
  } else {
    missing.push({ stableId: r.stableId, name: r.name, cleanId });
  }
});

console.log(`Matched ${matched} of ${reportItems.length} inventory reports in registry.`);
console.log(`Missing count: ${missing.length}`);
if (missing.length > 0) {
  console.log('Sample missing:', missing.slice(0, 10));
}
