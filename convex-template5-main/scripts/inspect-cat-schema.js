const fs = require('fs');

const registryContent = fs.readFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/reports-registry.ts', 'utf8');

// Check schema definitions for items
console.log('Sample category definitions:');
const sampleCat = registryContent.slice(registryContent.indexOf('export const REPORTS_REGISTRY'), registryContent.indexOf('export const REPORTS_REGISTRY') + 2000);
console.log(sampleCat);
