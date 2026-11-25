const fs = require('fs');

const manifestLines = fs.readFileSync('docs/SOURCE-SYNC-MANIFEST.txt', 'utf8').trim().split('\n');
console.log('Total entries:', manifestLines.length);
console.log('Sample first 5 entries:');
console.log(manifestLines.slice(0, 5).join('\n'));
console.log('\nSample last 5 entries:');
console.log(manifestLines.slice(-5).join('\n'));

// Verify no env files other than .env.example are in manifest
const envEntries = manifestLines.filter(l => l.includes('.env'));
console.log('\nEnv entries present in manifest:');
console.log(envEntries);
