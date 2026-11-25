const http = require('http');

http.get('http://localhost:3000/reports', (res) => {
  console.log('Status code for /reports:', res.statusCode);
  console.log('Redirect location:', res.headers.location || 'None');
}).on('error', (err) => {
  console.error('Request error:', err.message);
});
