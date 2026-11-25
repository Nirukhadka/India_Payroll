const WebSocket = require('../node_modules/ws');
const http = require('http');

http.get('http://127.0.0.1:9222/json/list', (res) => {
  let data = '';
  res.on('data', (c) => (data += c));
  res.on('end', () => {
    const tab = JSON.parse(data).find((t) => t.url && t.url.includes('localhost:3000'));
    console.log('Tab URL:', tab.url);
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(
        JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: {
            expression:
              'JSON.stringify({ title: document.title, url: location.href, hasBuildError: document.body.innerText.includes("Build Error"), textSample: document.body.innerText.substring(0, 300) })',
            returnByValue: true,
          },
        })
      );
    });
    ws.on('message', (d) => {
      const msg = JSON.parse(d);
      if (msg.result && msg.result.result) {
        console.log('Result:', JSON.parse(msg.result.result.value));
      } else {
        console.log('Raw:', msg);
      }
      ws.close();
      process.exit(0);
    });
  });
});
