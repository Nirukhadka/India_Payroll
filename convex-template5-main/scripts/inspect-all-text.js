const WebSocket = require('../node_modules/ws');
const http = require('http');
const fs = require('fs');

async function getTabs() {
  return new Promise((resolve) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
}

async function main() {
  const tabs = await getTabs();
  const greythrTab = tabs.find((t) => t.url && t.url.includes('victorchasex.greythr.com'));
  const ws = new WebSocket(greythrTab.webSocketDebuggerUrl);

  let id = 1;
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const msgId = id++;
      const handler = (data) => {
        const msg = JSON.parse(data);
        if (msg.id === msgId) {
          ws.off('message', handler);
          resolve(msg.result);
        }
      };
      ws.send(JSON.stringify({ id: msgId, method, params }));
      ws.on('message', handler);
    });

  ws.on('open', async () => {
    const script = `
      (() => {
        const allText = Array.from(document.querySelectorAll('*'))
          .filter(e => e.children.length === 0 && e.innerText && e.innerText.trim())
          .map(e => e.innerText.trim());

        // Check if there are iframes or shadow roots
        const iframes = Array.from(document.querySelectorAll('iframe')).map(f => f.src);

        return {
          allTextCount: allText.length,
          allTextSample: allText.slice(0, 50),
          iframes
        };
      })()
    `;

    const res = await send('Runtime.evaluate', {
      expression: script,
      returnByValue: true,
    });

    console.log(JSON.stringify(res.result.value, null, 2));
    ws.close();
    process.exit(0);
  });
}

main().catch(console.error);
