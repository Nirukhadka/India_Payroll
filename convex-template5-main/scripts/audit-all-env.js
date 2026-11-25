const fs = require('fs');
const path = require('path');

function findEnv(dir) {
  let envs = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === '.next' || e.name === '.turbo') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      envs = envs.concat(findEnv(full));
    } else if (e.name.includes('.env')) {
      envs.push({ rel: path.relative('.', full).replace(/\\/g, '/'), size: fs.statSync(full).size });
    }
  }
  return envs;
}

console.log(JSON.stringify(findEnv('.'), null, 2));
