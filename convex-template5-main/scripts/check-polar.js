const fs = require('fs');
const content = fs.readFileSync('packages/backend/convex/schema.ts', 'utf8');

const polarMatches = content.match(/polar/gi);
console.log('Polar matches in schema.ts:', polarMatches ? polarMatches.length : 0);

const polarFiles = [];
function findPolar(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = dir + '/' + f;
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') findPolar(full);
    } else if (f.endsWith('.ts') || f.endsWith('.js')) {
      const code = fs.readFileSync(full, 'utf8');
      if (code.includes('polar') || code.includes('Polar')) {
        polarFiles.push(full);
      }
    }
  });
}
findPolar('packages/backend/convex');
console.log('Files referencing Polar in backend:', polarFiles);
