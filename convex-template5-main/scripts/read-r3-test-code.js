const fs = require('fs');
const testCode = fs.readFileSync('tests/reports-gallery-r3-payroll.test.js', 'utf8');
console.log('--- tests/reports-gallery-r3-payroll.test.js ---');
console.log(testCode);
