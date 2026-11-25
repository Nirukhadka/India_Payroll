const fs = require('fs');

console.log('--- packages/backend/convex/convex.config.ts ---');
console.log(fs.readFileSync('packages/backend/convex/convex.config.ts', 'utf8'));

console.log('\n--- packages/backend/convex/subscriptions.ts (first 1000 chars) ---');
console.log(fs.readFileSync('packages/backend/convex/subscriptions.ts', 'utf8').slice(0, 1000));
