const fs = require('fs');
if (fs.existsSync('apps/app/src/env.mjs')) {
  console.log('apps/app/src/env.mjs:');
  console.log(fs.readFileSync('apps/app/src/env.mjs', 'utf8'));
} else {
  console.log('apps/app/src/env.mjs not found');
}
