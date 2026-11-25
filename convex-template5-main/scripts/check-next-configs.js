const fs = require('fs');

console.log('--- apps/app next.config ---');
['apps/app/next.config.mjs', 'apps/app/next.config.js', 'apps/app/next.config.ts'].forEach(f => {
  if (fs.existsSync(f)) console.log(f, fs.readFileSync(f, 'utf8').slice(0, 1000));
});

console.log('\n--- apps/web next.config ---');
['apps/web/next.config.mjs', 'apps/web/next.config.js', 'apps/web/next.config.ts'].forEach(f => {
  if (fs.existsSync(f)) console.log(f, fs.readFileSync(f, 'utf8').slice(0, 1000));
});
