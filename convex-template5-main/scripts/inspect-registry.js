const fs = require('fs');
const content = fs.readFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/reports-registry.ts', 'utf8');
console.log('Registry file size:', content.length, 'bytes');

const match = content.match(/REPORTS_REGISTRY:\s*ReportCategoryDefinition\[\]\s*=\s*\[([\s\S]*?)\];/);
if (match) {
  console.log('Found REPORTS_REGISTRY array');
}
const catMatches = content.match(/id:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g);
console.log('Matched categories/items count:', catMatches ? catMatches.length : 0);
