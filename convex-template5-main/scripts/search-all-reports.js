const fs = require('fs');
const path = require('path');

function searchAll(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(searchAll(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const allFiles = searchAll('apps/app/src/app').filter(f => f.toLowerCase().includes('report'));
console.log('All files containing "report":', allFiles);
