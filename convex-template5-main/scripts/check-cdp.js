const http = require('http');

http.get('http://localhost:9222/json/list', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const targets = JSON.parse(data);
      console.log('CDP targets count:', targets.length);
      console.log(targets.map(t => ({ title: t.title, url: t.url })));
    } catch (e) {
      console.log('Error parsing CDP targets:', e.message);
    }
  });
}).on('error', (err) => {
  console.log('CDP connection error:', err.message);
});
