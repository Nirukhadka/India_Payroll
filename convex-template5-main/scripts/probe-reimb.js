const http = require('http');

http.get('http://localhost:3000/admin/payroll/reimbursements', (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers.location || 'No redirect');
}).on('error', (err) => {
  console.error('Request error:', err.message);
});
