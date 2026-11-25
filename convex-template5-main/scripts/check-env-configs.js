const fs = require('fs');
const path = require('path');

function checkEnv(filePath) {
  if (fs.existsSync(filePath)) {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    const keys = lines
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#'))
      .map(l => l.split('=')[0]);
    return { exists: true, keys };
  }
  return { exists: false, keys: [] };
}

console.log('Root env files:');
['.env', '.env.local', '.env.example', '.env.production'].forEach(f => {
  console.log(f, checkEnv(f));
});

console.log('\napps/app env files:');
['apps/app/.env', 'apps/app/.env.local', 'apps/app/.env.example', 'apps/app/.env.production'].forEach(f => {
  console.log(f, checkEnv(f));
});

console.log('\napps/web env files:');
['apps/web/.env', 'apps/web/.env.local', 'apps/web/.env.example', 'apps/web/.env.production'].forEach(f => {
  console.log(f, checkEnv(f));
});

console.log('\npackages/backend env files:');
['packages/backend/.env', 'packages/backend/.env.local', 'packages/backend/.env.example'].forEach(f => {
  console.log(f, checkEnv(f));
});
