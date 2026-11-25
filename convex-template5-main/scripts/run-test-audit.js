const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main';
const testDir = path.join(repoRoot, 'tests');
const files = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'));

console.log('Running test audit across all ' + files.length + ' suites...\n');

const suiteResults = [];

for (const file of files) {
  const fullPath = path.join(testDir, file);
  const start = Date.now();
  try {
    const stdout = execSync(`node "${fullPath}"`, {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    const duration = Date.now() - start;

    // Parse assertions / subtests
    const lines = stdout.split('\n');
    let passCount = 0;
    let failCount = 0;
    for (const l of lines) {
      if (l.trim().startsWith('✔') || l.includes('pass ')) {
        passCount++;
      } else if (l.trim().startsWith('✖') || l.includes('fail ')) {
        failCount++;
      }
    }

    suiteResults.push({
      file,
      passed: true,
      duration: duration + 'ms',
      outputSnippet: stdout.slice(0, 300).replace(/\n+/g, ' ')
    });
    console.log(`[PASS] ${file} (${duration}ms)`);
  } catch (err) {
    const duration = Date.now() - start;
    suiteResults.push({
      file,
      passed: false,
      duration: duration + 'ms',
      error: err.message,
      stdout: err.stdout ? err.stdout.slice(0, 300) : '',
      stderr: err.stderr ? err.stderr.slice(0, 300) : ''
    });
    console.error(`[FAIL] ${file} (${duration}ms):`, err.message);
  }
}

console.log('\n=======================================');
console.log(`Total Suites: ${suiteResults.length}`);
console.log(`Passed Suites: ${suiteResults.filter(s => s.passed).length}`);
console.log(`Failed Suites: ${suiteResults.filter(s => !s.passed).length}`);

fs.writeFileSync(
  path.join(repoRoot, 'docs/phase18-2-test-audit-results.json'),
  JSON.stringify(suiteResults, null, 2),
  'utf8'
);
