const http = require('http');

http.get('http://localhost:9222/json/version', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('CDP Version:', data));
}).on('error', (err) => {
  console.log('Port 9222 error:', err.message);
});
