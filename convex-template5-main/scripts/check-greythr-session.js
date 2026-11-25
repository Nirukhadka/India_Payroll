const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:9222/devtools/page/A33683EC6FC65410ACED04A22E657B9C');

ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        return {
          url: window.location.href,
          title: document.title,
          isLoggedIn: !document.querySelector('input[type="password"]'),
          sampleText: document.body.innerText.slice(0, 200).replace(/\\s+/g, ' ')
        };
      })()`,
      returnByValue: true
    }
  }));
});

ws.on('message', (msg) => {
  const res = JSON.parse(msg);
  if (res.id === 1) {
    console.log('greytHR Session Status:', res.result.result.value);
    ws.close();
  }
});
