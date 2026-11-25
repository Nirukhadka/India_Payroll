const fs = require('fs');
const content = fs.readFileSync('apps/app/src/app/[locale]/(dashboard)/reports/page.tsx', 'utf8');
const lines = content.split('\n');
console.log('Total lines in (dashboard)/reports/page.tsx:', lines.length);

// Let us find how report execution, parameter modal, and exports are implemented
const modalLine = lines.findIndex(l => l.includes('selectedReport') || l.includes('handleRun') || l.includes('handleExport'));
console.log('Key methods lines:');
lines.forEach((l, idx) => {
  if (l.includes('function handle') || l.includes('const handle') || l.includes('selectedReport &&')) {
    console.log(`  Line ${idx + 1}: ${l.trim()}`);
  }
});
