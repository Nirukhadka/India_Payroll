const fs = require('fs');

console.log('--- schema.ts: payrollRuns ---');
const schema = fs.readFileSync('packages/backend/convex/schema.ts', 'utf8');

function printTable(tableName) {
  const start = schema.indexOf(`${tableName}: defineTable({`);
  if (start === -1) return 'Not found';
  const end = schema.indexOf('})', start);
  console.log(schema.slice(start, end + 2));
}

printTable('payrollRuns');
console.log('\n--- schema.ts: payrollItems ---');
printTable('payrollItems');
