const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main';
const testDir = path.join(repoRoot, 'tests');
const files = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'));

const detailResults = [];

for (const file of files) {
  const fullPath = path.join(testDir, file);
  try {
    const stdout = execSync(`node "${fullPath}"`, {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });

    const lines = stdout.split('\n');
    const tests = lines.filter(l => l.includes('✔') || l.includes('✅')).map(l => l.trim());
    const fails = lines.filter(l => l.includes('✖') || l.includes('❌')).map(l => l.trim());

    detailResults.push({
      file,
      passed: true,
      passedTests: tests.length,
      failedTests: fails.length,
      sampleTests: tests.slice(0, 5)
    });
  } catch (err) {
    detailResults.push({
      file,
      passed: false,
      passedTests: 0,
      failedTests: 1,
      error: err.message
    });
  }
}

console.log(JSON.stringify(detailResults, null, 2));
const totalPassed = detailResults.reduce((a, b) => a + b.passedTests, 0);
console.log('Total assertions/tests passed:', totalPassed);
