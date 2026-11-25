const fs = require('fs');
const path = require('path');

function findFiles(dir, match) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(fullPath, match));
    } else if (match(file)) {
      results.push(fullPath);
    }
  });
  return results;
}

const reportsFiles = findFiles('apps/app/src/app', f => f.includes('report') || f.includes('gallery'));
console.log('App reports files:', reportsFiles);

const convexFiles = findFiles('packages/backend/convex', f => f.includes('report'));
console.log('Convex reports files:', convexFiles);
