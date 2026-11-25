const fs = require('fs');

const registryContent = fs.readFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/reports-registry.ts', 'utf8');

const paramSet = new Set();
const paramRegex = /parameters:\s*(\[[^\]]+\])/g;
let m;
while ((m = paramRegex.exec(registryContent)) !== null) {
  try {
    const arr = JSON.parse(m[1]);
    arr.forEach(p => paramSet.add(p));
  } catch (e) {}
}

console.log('Unique parameter tags currently in registry:');
console.log([...paramSet]);
