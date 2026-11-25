const fs = require('fs');
const content = fs.readFileSync('packages/backend/convex/schema.ts', 'utf8');

const tables = [];
const tableRegex = /(\w+):\s*defineTable\(\{/g;
let m;
while ((m = tableRegex.exec(content)) !== null) {
  tables.push(m[1]);
}
console.log('Tables in schema.ts:', tables);
console.log('Reports-related tables:', tables.filter(t => t.toLowerCase().includes('report') || t.toLowerCase().includes('query') || t.toLowerCase().includes('favorite')));
