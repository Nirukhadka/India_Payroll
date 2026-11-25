const fs = require('fs');

const registryContent = fs.readFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/reports-registry.ts', 'utf8');

const reportRegex = /id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*supportedFormats:\s*(\[[^\]]+\]),\s*status:\s*"([^"]+)",\s*parameters:\s*(\[[^\]]+\]),\s*isDraftStatutory:\s*(true|false)/g;

let m;
const catParamMap = {};
while ((m = reportRegex.exec(registryContent)) !== null) {
  const cat = m[3];
  const params = JSON.parse(m[7]);
  if (!catParamMap[cat]) catParamMap[cat] = new Set();
  params.forEach(p => catParamMap[cat].add(p));
}

Object.entries(catParamMap).forEach(([cat, pSet]) => {
  console.log(`${cat}: [${[...pSet].join(', ')}]`);
});
