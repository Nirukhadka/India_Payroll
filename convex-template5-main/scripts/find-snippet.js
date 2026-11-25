const fs = require('fs');
const content = fs.readFileSync('docs/greythr-settings-states.js', 'utf8');

const target = 'settings.general.company-info';
const idx = content.indexOf(target);
if (idx !== -1) {
  console.log('Snippet around company-info:\n', content.substring(idx - 100, idx + 600));
} else {
  console.log('Not found');
}
