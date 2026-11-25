const fs = require('fs');
const content = fs.readFileSync('packages/backend/convex/schema.ts', 'utf8');

function extractTable(name) {
  const start = content.indexOf(`${name}: defineTable({`);
  if (start === -1) return 'Not found';
  const end = content.indexOf('})', start);
  return content.slice(start, end + 2);
}

console.log(extractTable('reportFavorites'));
console.log('\n-------------------\n');
console.log(extractTable('reportRuns'));
console.log('\n-------------------\n');
console.log(extractTable('savedQueries'));
