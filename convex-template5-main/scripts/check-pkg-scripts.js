const fs = require('fs');

console.log('--- package.json scripts ---');
const rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log('Root scripts:', rootPkg.scripts);

console.log('\n--- apps/app/package.json scripts ---');
const appPkg = JSON.parse(fs.readFileSync('apps/app/package.json', 'utf8'));
console.log('App scripts:', appPkg.scripts);

console.log('\n--- apps/web/package.json scripts ---');
const webPkg = JSON.parse(fs.readFileSync('apps/web/package.json', 'utf8'));
console.log('Web scripts:', webPkg.scripts);

console.log('\n--- packages/backend/package.json scripts ---');
const backendPkg = JSON.parse(fs.readFileSync('packages/backend/package.json', 'utf8'));
console.log('Backend scripts:', backendPkg.scripts);
