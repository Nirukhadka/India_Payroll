const http = require('http');

http.get('http://localhost:9222/json/version', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('CDP 9222 active:', data));
}).on('error', (err) => {
  console.log('CDP 9222 not reachable:', err.message);
});
