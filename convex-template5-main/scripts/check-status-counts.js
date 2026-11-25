const fs = require('fs');

const registryContent = fs.readFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/reports-registry.ts', 'utf8');

const statusCounts = {};
const statusRegex = /status:\s*"([^"]+)"/g;
let m;
while ((m = statusRegex.exec(registryContent)) !== null) {
  statusCounts[m[1]] = (statusCounts[m[1]] || 0) + 1;
}
console.log('Status counts in registry:', statusCounts);
