const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function walk(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.relative('.', full).replace(/\\/g, '/');

    // Exclusion rules
    if (rel.startsWith('.git') || rel.includes('/node_modules') || rel.startsWith('node_modules') || rel.includes('/.next') || rel.startsWith('.next') || rel.includes('/.turbo') || rel.startsWith('.turbo')) continue;
    if (entry.name.startsWith('.env') && !entry.name.endsWith('.example')) continue;
    if (entry.name.endsWith('.bak') || entry.name.endsWith('.bak2') || entry.name.endsWith('.log')) continue;
    if (rel.startsWith('scripts/') && !['scripts/provisionDevAccounts.ts', 'scripts/patch-node-windows.js'].includes(rel)) continue;

    if (entry.isDirectory()) {
      files = files.concat(walk(full));
    } else {
      const buf = fs.readFileSync(full);
      const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
      files.push({ rel, size: buf.length, sha256 });
    }
  }
  return files;
}

const manifest = walk('.');
console.log('Total audited files in source manifest:', manifest.length);

const stream = fs.createWriteStream('docs/SOURCE-SYNC-MANIFEST.txt');
manifest.forEach(f => stream.write(`${f.sha256}  ${f.rel}\n`));
stream.end();

console.log('Saved docs/SOURCE-SYNC-MANIFEST.txt');
