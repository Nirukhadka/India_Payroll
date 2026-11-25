const fs = require('fs');
const schema = fs.readFileSync('packages/backend/convex/schema.ts', 'utf8');

const piIdx = schema.indexOf('payrollItems: defineTable({');
console.log(schema.slice(piIdx + 800, piIdx + 2000));
