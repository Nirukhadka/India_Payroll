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
    // Fetch /v2/ng/states/settings
    const res = await send('Runtime.evaluate', {
      expression: `
        (async () => {
          try {
            const r = await fetch('/v2/ng/states/settings?v6.3.0-prod-14307');
            const text = await r.text();
            return { length: text.length, snippet: text.substring(0, 3000), full: text };
          } catch(e) {
            return { error: e.message };
          }
        })()
      `,
      awaitPromise: true,
      returnByValue: true,
    });

    if (res.result.value.full) {
      fs.writeFileSync('docs/greythr-settings-states.js', res.result.value.full);
      console.log('Saved settings states file! Length:', res.result.value.length);
    } else {
      console.log('Failed to fetch settings states:', res.result.value);
    }

    ws.close();
    process.exit(0);
  });
}

main().catch(console.error);
